import { UserBalance } from '../../Transaction/userBalance.model';
import type { ProviderRecord } from '../types/provider';
import { TransactionService } from './transaction.service';

type TxServerResponse = {
  status?: boolean;
  message?: string;
  total_records?: number;
  data?:
    | ProviderRecord[]
    | { payload?: { records?: ProviderRecord[]; total_count?: number } };
};

type IngestStats = {
  accepted: number;
  duplicates: number;
  errors: number;
  balancesUpdated: number;
  skippedNoBalance: number;
};

type IngestMarker = {
  date: string;
  lastTimestamp: string;
  lastSerial: string;
};

export type SyncUserResult = {
  providerTotal: number;
  newRecords: number;
  stats: IngestStats;
  currentBalance: number;
  syncedAt: string;
  skippedReason?: 'no_provider_records' | 'no_new_records';
};

const BATCH_SIZE = 50;
const BATCH_DELAY_MS = 500;

/** Prevent parallel sync-user calls from double-applying the same vendor rows. */
const syncInflight = new Map<string, Promise<SyncUserResult>>();

/**
 * Pulls vendor bet rows (testHuidu.php), ingests only records newer than the
 * per-user UTC-day marker, batches through /ingest logic for turnover + bulk insert.
 */
export class TxProviderSyncService {
  constructor(
    private readonly providerBaseUrl =
      process.env.GAME_TX_PROVIDER_URL ?? 'https://txserver.site/testHuidu.php',
    private readonly txService = new TransactionService()
  ) {}

  private buildProviderUrl(sbmId: string): string {
    const base = this.providerBaseUrl.replace(/\/$/, '');
    const separator = base.includes('?') ? '&' : '?';
    return `${base}${separator}user=${encodeURIComponent(sbmId)}`;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private normalizeVendorRecords(json: TxServerResponse): ProviderRecord[] {
    if (Array.isArray(json.data)) {
      return json.data;
    }
    const payload = json.data && typeof json.data === 'object' ? json.data.payload : undefined;
    if (payload?.records && Array.isArray(payload.records)) {
      return payload.records;
    }
    if (Array.isArray(payload)) {
      return payload as ProviderRecord[];
    }
    return [];
  }

  private isRecordNewer(
    rTimestamp: string,
    rSerial: string,
    markerTimestamp: string,
    markerSerial: string
  ): boolean {
    if (!markerTimestamp) return true;
    if (rTimestamp > markerTimestamp) return true;
    if (rTimestamp === markerTimestamp && rSerial > markerSerial) return true;
    return false;
  }

  private todayUtc(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private readMarker(raw: unknown): IngestMarker {
    const empty: IngestMarker = { date: '', lastTimestamp: '', lastSerial: '' };
    if (!raw || typeof raw !== 'object') return empty;
    const m = raw as Partial<IngestMarker>;
    return {
      date: String(m.date ?? ''),
      lastTimestamp: String(m.lastTimestamp ?? ''),
      lastSerial: String(m.lastSerial ?? ''),
    };
  }

  private async fetchProviderRecords(sbmId: string): Promise<{
    records: ProviderRecord[];
    totalRecords: number;
  }> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch(this.buildProviderUrl(sbmId), {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Game provider returned HTTP ${response.status}`);
      }

      const json = (await response.json()) as TxServerResponse;
      if (json.status === false) {
        throw new Error(json.message ?? 'Game provider sync failed');
      }

      const records = this.normalizeVendorRecords(json);
      const totalRecords =
        json.total_records ??
        (json.data &&
        typeof json.data === 'object' &&
        'payload' in json.data &&
        json.data.payload?.total_count) ??
        records.length;

      return { records, totalRecords: Number(totalRecords) || records.length };
    } finally {
      clearTimeout(timeout);
    }
  }

  private emptyIngestStats(): IngestStats {
    return {
      accepted: 0,
      duplicates: 0,
      errors: 0,
      balancesUpdated: 0,
      skippedNoBalance: 0,
    };
  }

  private async postIngestBatch(batch: ProviderRecord[]): Promise<IngestStats> {
    const stats = await this.txService.ingest({ records: batch });
    return {
      accepted: Number(stats.accepted ?? 0),
      duplicates: Number(stats.duplicates ?? 0),
      errors: Number(stats.errors ?? 0),
      balancesUpdated: Number(stats.balancesUpdated ?? 0),
      skippedNoBalance: Number(stats.skippedNoBalance ?? 0),
    };
  }

  async syncForUser(sbmId: string): Promise<SyncUserResult> {
    const normalizedId = sbmId.trim().toLowerCase();
    if (!normalizedId) {
      throw new Error('Member id is required for game sync');
    }

    const inflight = syncInflight.get(normalizedId);
    if (inflight) return inflight;

    const run = this.runSyncForUser(normalizedId).finally(() => {
      syncInflight.delete(normalizedId);
    });
    syncInflight.set(normalizedId, run);
    return run;
  }

  private async runSyncForUser(normalizedId: string): Promise<SyncUserResult> {
    const emptyStats = this.emptyIngestStats();

    const { records: vendorRecords, totalRecords } =
      await this.fetchProviderRecords(normalizedId);

    const balanceDoc = await UserBalance.findOne({ id: normalizedId })
      .select('currentBalance gameIngestMarker')
      .lean();

    const currentBalance = Number(balanceDoc?.currentBalance ?? 0);

    if (!vendorRecords.length) {
      return {
        providerTotal: totalRecords,
        newRecords: 0,
        stats: emptyStats,
        currentBalance,
        syncedAt: new Date().toISOString(),
        skippedReason: 'no_provider_records',
      };
    }

    const todayUTC = this.todayUtc();
    let marker = this.readMarker(balanceDoc?.gameIngestMarker);
    if (marker.date !== todayUTC) {
      marker = { date: todayUTC, lastTimestamp: '', lastSerial: '' };
    }

    const newRecords = vendorRecords.filter((r) =>
      this.isRecordNewer(
        String(r.timestamp ?? ''),
        String(r.serial_number ?? ''),
        marker.lastTimestamp,
        marker.lastSerial
      )
    );

    if (newRecords.length === 0) {
      await UserBalance.updateOne(
        { id: normalizedId },
        { $set: { lastGameSyncAt: new Date(), gameIngestMarker: marker } }
      ).catch(() => undefined);

      return {
        providerTotal: totalRecords,
        newRecords: 0,
        stats: emptyStats,
        currentBalance,
        syncedAt: new Date().toISOString(),
        skippedReason: 'no_new_records',
      };
    }

    const sortedNew = [...newRecords].sort((a, b) => {
      const ta = String(a.timestamp ?? '');
      const tb = String(b.timestamp ?? '');
      if (ta === tb) {
        return String(b.serial_number ?? '').localeCompare(String(a.serial_number ?? ''));
      }
      return tb.localeCompare(ta);
    });

    let stats: IngestStats = { ...emptyStats };

    for (let i = 0; i < sortedNew.length; i += BATCH_SIZE) {
      const batch = sortedNew.slice(i, i + BATCH_SIZE);
      const batchStats = await this.postIngestBatch(batch);
      stats = {
        accepted: stats.accepted + (batchStats.accepted ?? 0),
        duplicates: stats.duplicates + (batchStats.duplicates ?? 0),
        errors: stats.errors + (batchStats.errors ?? 0),
        balancesUpdated: stats.balancesUpdated + (batchStats.balancesUpdated ?? 0),
        skippedNoBalance: stats.skippedNoBalance + (batchStats.skippedNoBalance ?? 0),
      };

      const batchNewest = batch.reduce((best, row) => {
        const ts = String(row.timestamp ?? '');
        const serial = String(row.serial_number ?? '');
        if (!best) return { ts, serial };
        if (ts > best.ts) return { ts, serial };
        if (ts === best.ts && serial > best.serial) return { ts, serial };
        return best;
      }, null as { ts: string; serial: string } | null);

      if (batchNewest) {
        const batchMarker: IngestMarker = {
          date: todayUTC,
          lastTimestamp: batchNewest.ts,
          lastSerial: batchNewest.serial,
        };
        await UserBalance.updateOne(
          { id: normalizedId },
          { $set: { lastGameSyncAt: new Date(), gameIngestMarker: batchMarker } }
        ).catch(() => undefined);
      }

      if (i + BATCH_SIZE < sortedNew.length) {
        await this.delay(BATCH_DELAY_MS);
      }
    }

    const newest = sortedNew[0];
    const nextMarker: IngestMarker = {
      date: todayUTC,
      lastTimestamp: String(newest.timestamp ?? ''),
      lastSerial: String(newest.serial_number ?? ''),
    };

    const refreshed = await UserBalance.findOne({ id: normalizedId })
      .select('currentBalance')
      .lean();

    await UserBalance.updateOne(
      { id: normalizedId },
      {
        $set: {
          lastGameSyncAt: new Date(),
          gameIngestMarker: nextMarker,
        },
      }
    ).catch(() => undefined);

    return {
      providerTotal: totalRecords,
      newRecords: sortedNew.length,
      stats,
      currentBalance: Number(refreshed?.currentBalance ?? currentBalance),
      syncedAt: new Date().toISOString(),
    };
  }
}
