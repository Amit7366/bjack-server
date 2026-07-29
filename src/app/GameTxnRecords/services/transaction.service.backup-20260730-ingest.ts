import mongoose, { Types } from 'mongoose';
import { IngestBody, ProviderRecord } from '../types/provider';
import { extractSbmId, parseUtc } from '../utils/member';
import { TransactionRepository } from '../repositories/transaction.repository';
import { GameTxnRecord } from '../models/GameTxnRecord';
import { UserBalance } from '../../Transaction/userBalance.model';
import os from 'os';
import { applyTurnoverForInsertedBets } from '../utils/turnoverProgress.util';
import {
  applyUsedGgrIncrement,
  ensureGgrBalance,
  sumUsedGgrDelta,
} from './ggrBalance.service';

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

function collectInsertedIndices(result: {
  insertedIds?: Record<string, unknown>;
  insertedCount?: number;
  getInsertedIds?: () => Array<{ index: number }>;
  nInserted?: number;
}): number[] {
  if (result.insertedIds) {
    return Object.keys(result.insertedIds).map((k) => parseInt(k, 10));
  }
  try {
    const ids = result.getInsertedIds?.();
    if (ids?.length) return ids.map((x) => x.index);
  } catch {
    /* ignore */
  }
  if (typeof result.insertedCount === 'number' && result.insertedCount > 0) {
    return Array.from({ length: result.insertedCount }, (_, idx) => idx);
  }
  if (typeof result.nInserted === 'number' && result.nInserted > 0) {
    return Array.from({ length: result.nInserted }, (_, idx) => idx);
  }
  return [];
}

/** Insert rows; return only indices Mongo reports as newly inserted (no fallback re-query). */
async function insertGameTxnDocs(docsToInsert: Record<string, unknown>[]): Promise<number[]> {
  try {
    const res = await GameTxnRecord.collection.insertMany(docsToInsert, { ordered: false });
    return collectInsertedIndices(res);
  } catch (err: unknown) {
    const bulkErr = err as {
      insertedIds?: Record<string, unknown>;
      insertedCount?: number;
      getInsertedIds?: () => Array<{ index: number }>;
      nInserted?: number;
      result?: {
        insertedIds?: Record<string, unknown>;
        insertedCount?: number;
        getInsertedIds?: () => Array<{ index: number }>;
        nInserted?: number;
      };
    };
    let partial = collectInsertedIndices(bulkErr);
    if (!partial.length && bulkErr.result) {
      partial = collectInsertedIndices(bulkErr.result);
    }
    if (partial.length) return partial;
    throw err;
  }
}

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
    let totalUsedGgrAdded = 0;

    await ensureGgrBalance();

    // cache maps sbmId -> { ubId: ObjectId | null, userId: ObjectId | null }
    const cacheSbmToUb = new Map<string, { ubId: Types.ObjectId | null; userId: Types.ObjectId | null }>();
    const normalizedBatches: Normalized[][] = [];

    const seenTxnIds = new Set<string>();
    const allNormalized: Normalized[] = [];

    for (let i = 0; i < records.length; i++) {
      const r = records[i];
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

      if (seenTxnIds.has(txnId)) {
        totalDuplicates++;
        continue;
      }
      seenTxnIds.add(txnId);

      allNormalized.push({
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
        _docIndex: i,
        alreadyTaken: false,
      });
    }

    for (let i = 0; i < allNormalized.length; i += BATCH_SIZE) {
      const slice = allNormalized.slice(i, i + BATCH_SIZE);
      if (slice.length) normalizedBatches.push(slice);
    }

    if (normalizedBatches.length === 0) {
      return {
        accepted: 0,
        duplicates: 0,
        errors: totalErrors,
        balancesUpdated: 0,
        skippedNoBalance: 0,
        usedGgrAdded: 0,
      };
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
        if (!ubCache?.ubId || !ubCache.userId) {
          skippedNoBalance++;
          continue;
        }

        docsToInsert.push({
          txnId: n.txnId,
          agencyUid: n.agency,
          memberAccount: n.member,
          sbmId: n.sbmId,
          userBalanceId: ubCache.ubId,
          userId: ubCache.userId,
          gameUid: n.gameUid,
          gameRound: n.roundId,
          currencyCode: n.currency,
          bet: n.bet,
          win: n.win,
          providerTsUtc: n.tsUtc,
          alreadyTaken: n.alreadyTaken ?? false,
        });
      }

      totalSkippedNoBalance += skippedNoBalance;
      totalDuplicates += duplicatesLocal;

      if (docsToInsert.length === 0) {
        return { accepted: 0, duplicates: duplicatesLocal, balancesUpdated: 0, usedGgrAdded: 0 };
      }

      const insertedIndices = await insertGameTxnDocs(docsToInsert);

      // Compute balance deltas only for inserted docs
      const balanceDelta = new Map<string, number>();
      let localAccepted = 0;
      const insertedDocs: typeof docsToInsert = [];
      for (const idx of insertedIndices) {
        const d = docsToInsert[idx];
        if (!d) continue;
        localAccepted++;
        insertedDocs.push(d);
        const ubIdStr = String(d.userBalanceId);
        const delta = +(d.win - d.bet);
        balanceDelta.set(ubIdStr, (balanceDelta.get(ubIdStr) || 0) + delta);
      }

      // Prepare bulk balance updates aggregated per userBalanceId.
      // Skip $inc while gameSessionActive — P/L is restored via getWithdraw on return.
      const ubIds = [...balanceDelta.keys()].map((id) => new Types.ObjectId(id));
      const activeSessions =
        ubIds.length > 0
          ? await UserBalance.find({
              _id: { $in: ubIds },
              gameSessionActive: true,
            })
              .select('_id')
              .lean()
          : [];
      const skipBalanceIds = new Set(activeSessions.map((d) => String(d._id)));

      const balanceOps: any[] = [];
      for (const [ubIdStr, sumDelta] of balanceDelta.entries()) {
        if (skipBalanceIds.has(ubIdStr)) continue;
        balanceOps.push({
          updateOne: {
            filter: { _id: new Types.ObjectId(ubIdStr) },
            update: { $inc: { currentBalance: sumDelta, walletRevision: 1 } },
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

      if (insertedDocs.length > 0) {
        await applyTurnoverForInsertedBets(insertedDocs);
      }

      // Loss bets only: used GGR += 10% of bet (bulk sum, one atomic $inc)
      let usedGgrAdded = 0;
      const usedGgrDelta = sumUsedGgrDelta(insertedDocs);
      if (usedGgrDelta > 0) {
        try {
          usedGgrAdded = await applyUsedGgrIncrement(usedGgrDelta);
        } catch {
          // best-effort; do not fail ingest if GGR tracking fails
        }
      }

      return { accepted: localAccepted, duplicates: duplicatesLocal, balancesUpdated, usedGgrAdded };
    };

    // Process normalized batches concurrently
    const resArray = await mapWithConcurrency(normalizedBatches, CONCURRENCY, async (batch) => {
      return await processBatch(batch);
    });

    for (const r of resArray) {
      if (!r) continue;
      totalAccepted += r.accepted ?? 0;
      totalBalancesUpdated += r.balancesUpdated ?? 0;
      totalUsedGgrAdded += r.usedGgrAdded ?? 0;
    }

    return {
      accepted: totalAccepted,
      duplicates: totalDuplicates,
      errors: totalErrors,
      balancesUpdated: totalBalancesUpdated,
      skippedNoBalance: totalSkippedNoBalance,
      usedGgrAdded: totalUsedGgrAdded,
    };
  }
}
