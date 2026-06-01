import mongoose, { Types } from 'mongoose';
import { IngestBody, ProviderRecord } from '../types/provider';
import { extractSbmId, parseUtc } from '../utils/member';
import { TransactionRepository } from '../repositories/transaction.repository';
import { GameTxnRecord } from '../models/GameTxnRecord';
import { UserBalance } from '../../Transaction/userBalance.model';
import os from 'os';

type Normalized = {
  txnId: string;
  member: string;
  sbmId: string;
  gameUid: string;
  currency: string;
  bet: number;
  win: number;
  agency: string;

  alreadyTaken: false;
  tsUtc: Date;
  roundId: string | null;
  delta: number;
  _docIndex?: number;
};

async function mapWithConcurrency<T, R>(items: T[], concurrency: number, fn: (t: T) => Promise<R>) {
  const results = new Array<R>(items.length);
  let i = 0;
  const workers = new Array(Math.max(1, concurrency)).fill(0).map(async () => {
    while (true) {
      const idx = i++;
      if (idx >= items.length) break;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      results[idx] = await fn(items[idx]);
    }
  });
  await Promise.all(workers);
  return results;
}

export class TransactionService {
  constructor(private repo = new TransactionRepository()) { }

  private pickRecords(body: IngestBody): ProviderRecord[] | null {
    if (Array.isArray(body.records)) return body.records;
    if (Array.isArray(body.data)) return body.data;
    if (body.data && typeof body.data === 'object' && 'payload' in body.data) {
      const nested = body.data.payload?.records;
      if (Array.isArray(nested)) return nested;
    }
    if (Array.isArray(body.payload?.records)) return body.payload.records;
    return null;
  }

  async ingest(body: IngestBody) {
    const records = this.pickRecords(body);
    if (!Array.isArray(records)) throw new Error('No records array');

    const cpuCount = Math.max(1, os.cpus().length || 1);
    const BATCH_SIZE = Math.min(1500, Math.max(400, 400 * cpuCount));
    const CONCURRENCY = Math.min(6, Math.max(1, Math.floor(cpuCount / 2) || 3));

    let totalAccepted = 0;
    let totalDuplicates = 0;
    let totalErrors = 0;
    let totalBalancesUpdated = 0;
    let totalSkippedNoBalance = 0;

    // cache maps sbmId -> { ubId: ObjectId | null, userId: ObjectId | null }
    const cacheSbmToUb = new Map<string, { ubId: Types.ObjectId | null; userId: Types.ObjectId | null }>();
    const normalizedBatches: Normalized[][] = [];

    // Normalize incoming records
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const slice = records.slice(i, i + BATCH_SIZE);
      const normalized: Normalized[] = [];
      for (let j = 0; j < slice.length; j++) {
        const r = slice[j];
        const txnId = String(r.serial_number ?? '').trim();
        const member = String(r.member_account ?? '').trim();
        const sbmId = extractSbmId(member);
        const gameUid = String(r.game_uid ?? '').trim();
        const currency = (String(r.currency_code ?? '').trim() || 'INR').toUpperCase();
        const bet = +(r.bet_amount ?? 0);
        const win = +(r.win_amount ?? 0);
        const agency = String(r.agency_uid ?? '');
        const tsUtc = r.timestamp ? parseUtc(String(r.timestamp)) : new Date();
        const roundId = r.game_round ? String(r.game_round) : null;

        if (!txnId || !sbmId || !gameUid || Number.isNaN(bet) || Number.isNaN(win)) {
          totalErrors++;
          continue;
        }

        normalized.push({
          txnId,
          member,
          sbmId,
          gameUid,
          currency,
          bet,
          win,
          agency,
          tsUtc,
          roundId,
          delta: +(win - bet),
          _docIndex: j,
          alreadyTaken: false,
        });
      }
      if (normalized.length) normalizedBatches.push(normalized);
    }

    if (normalizedBatches.length === 0) {
      return { accepted: 0, duplicates: 0, errors: totalErrors, balancesUpdated: 0, skippedNoBalance: 0 };
    }

    const processBatch = async (normalized: Normalized[]) => {
      // Figure out which sbmIds we still need to fetch (not in cache)
      const toFetchSbm = new Set<string>();
      for (const n of normalized) {
        if (!cacheSbmToUb.has(n.sbmId)) toFetchSbm.add(n.sbmId);
      }

      // Bulk fetch any missing UserBalance rows including their userId (optimization)
      if (toFetchSbm.size > 0) {
        const sbmList = Array.from(toFetchSbm);
        const ubRows = await UserBalance.find(
          { id: { $in: sbmList } },
          { _id: 1, id: 1, userId: 1 }
        ).lean();

        const found = new Set<string>();
        for (const ub of ubRows) {
          cacheSbmToUb.set(String(ub.id), {
            ubId: ub._id as Types.ObjectId,
            userId: (ub.userId as Types.ObjectId) ?? null, // ✅ fixed type cast
          });
          found.add(String(ub.id));
        }
        // mark missing sbmIds as nulls so we don't refetch later
        for (const s of sbmList) if (!found.has(s)) cacheSbmToUb.set(s, { ubId: null, userId: null });
      }

      // Pre-check duplicates by txnId
      const txnIds = normalized.map((n) => n.txnId);
      const existing = await GameTxnRecord.find({ txnId: { $in: txnIds } }, { txnId: 1 }).lean();
      const existingSet = new Set(existing.map((e) => e.txnId));

      const docsToInsert: any[] = [];
      let skippedNoBalance = 0;
      let duplicatesLocal = 0;

      for (const n of normalized) {
        if (existingSet.has(n.txnId)) {
          duplicatesLocal++;
          continue;
        }
        const ubCache = cacheSbmToUb.get(n.sbmId);
        if (!ubCache || !ubCache.ubId) {
          skippedNoBalance++;
          continue;
        }

        docsToInsert.push({
          txnId: n.txnId,
          agencyUid: n.agency,
          memberAccount: n.member,
          sbmId: n.sbmId,
          userBalanceId: ubCache.ubId,
          userId: ubCache.userId, // <-- NEW: insert userId from cache
          gameUid: n.gameUid,
          gameRound: n.roundId,
          currencyCode: n.currency,
          bet: n.bet,
          win: n.win,
          providerTsUtc: n.tsUtc,
          alreadyTaken: n.alreadyTaken ?? false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      totalSkippedNoBalance += skippedNoBalance;
      totalDuplicates += duplicatesLocal;

      if (docsToInsert.length === 0) {
        return { accepted: 0, duplicates: duplicatesLocal, balancesUpdated: 0 };
      }

      // Insert many with unordered for best throughput; gather inserted indices from result or error
      let insertedIndices: number[] = [];
      try {
        const res = await GameTxnRecord.collection.insertMany(docsToInsert, { ordered: false });
        if (res && res.insertedIds) {
          insertedIndices = Object.keys(res.insertedIds).map((k) => parseInt(k, 10));
        } else if (res && typeof res.insertedCount === 'number') {
          const cnt = res.insertedCount ?? 0;
          insertedIndices = Array.from({ length: cnt }, (_, idx) => idx);
        }
      } catch (err: any) {
        // MongoBulkWriteError or similar — attempt to extract inserted indices from result
        const result = err?.result ?? err?.writeResult ?? err;
        if (result) {
          try {
            if (result?.getInsertedIds) {
              const ids = result.getInsertedIds();
              insertedIndices = ids.map((x: any) => x.index);
            }
          } catch { }
          if (!insertedIndices.length && result.insertedIds) {
            insertedIndices = Object.keys(result.insertedIds).map((k) => parseInt(k, 10));
          }
          if (!insertedIndices.length && typeof result.nInserted === 'number') {
            insertedIndices = Array.from({ length: result.nInserted }, (_, idx) => idx);
          }
        }
      }

      // As fallback, check which txnIds actually exist (in case duplicate key caused failure w/o insertedIds)
      if (!insertedIndices.length) {
        const txnIdsBatch = docsToInsert.map((d) => d.txnId);
        const rows = await GameTxnRecord.find(
          { txnId: { $in: txnIdsBatch } },
          { txnId: 1, userBalanceId: 1, bet: 1, win: 1 }
        ).lean();
        const existingMap = new Map<string, any>();
        for (const r of rows) existingMap.set(r.txnId, r);
        for (let idx = 0; idx < docsToInsert.length; idx++) {
          if (existingMap.has(docsToInsert[idx].txnId)) insertedIndices.push(idx);
        }
      }

      // Compute balance deltas only for inserted docs
      const balanceDelta = new Map<string, number>();
      let localAccepted = 0;
      for (const idx of insertedIndices) {
        const d = docsToInsert[idx];
        if (!d) continue;
        localAccepted++;
        const ubIdStr = String(d.userBalanceId);
        const delta = +(d.win - d.bet);
        balanceDelta.set(ubIdStr, (balanceDelta.get(ubIdStr) || 0) + delta);
      }

      // Prepare bulk balance updates aggregated per userBalanceId
      const balanceOps: any[] = [];
      for (const [ubIdStr, sumDelta] of balanceDelta.entries()) {
        // use ObjectId for filter
        balanceOps.push({
          updateOne: {
            filter: { _id: new Types.ObjectId(ubIdStr) },
            update: { $inc: { currentBalance: sumDelta } },
          },
        });
      }

      let balancesUpdated = 0;
      if (balanceOps.length > 0) {
        try {
          const res = await UserBalance.bulkWrite(balanceOps, { ordered: false });
          balancesUpdated = res.modifiedCount ?? (res as any).nModified ?? 0;
        } catch {
          // ignore errors in balance updates (best-effort)
        }
      }

      return { accepted: localAccepted, duplicates: duplicatesLocal, balancesUpdated };
    };

    // Process normalized batches concurrently
    const resArray = await mapWithConcurrency(normalizedBatches, CONCURRENCY, async (batch) => {
      return await processBatch(batch);
    });

    for (const r of resArray) {
      if (!r) continue;
      totalAccepted += r.accepted ?? 0;
      totalBalancesUpdated += r.balancesUpdated ?? 0;
    }

    return {
      accepted: totalAccepted,
      duplicates: totalDuplicates,
      errors: totalErrors,
      balancesUpdated: totalBalancesUpdated,
      skippedNoBalance: totalSkippedNoBalance,
    };
  }
}
