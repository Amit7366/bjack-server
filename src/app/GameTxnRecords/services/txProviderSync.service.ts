import { randomUUID } from 'crypto';
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

export type PreviewSyncResult = {
  estimatedBalance: number;
  netDelta: number;
  newRecords: number;
  providerTotal: number;
  currentBalance: number;
  syncToken: string;
  walletRevision: number;
  syncedAt: string;
  skippedReason?: 'no_provider_records' | 'no_new_records';
};

export type PersistJobStatus = {
  syncToken: string;
  sbmId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  previewBalance?: number;
  dbBalance?: number;
  drift?: number;
  error?: string;
  startedAt: string;
  completedAt?: string;
};

const BATCH_SIZE = 50;
const BATCH_SIZE_URGENT = 200;
const BATCH_DELAY_MS = 500;

const syncInflight = new Map<string, Promise<SyncUserResult>>();
const previewInflight = new Map<string, Promise<PreviewSyncResult>>();
const persistInflight = new Map<string, Promise<void>>();
const persistJobs = new Map<string, PersistJobStatus>();
const persistByUser = new Map<string, string>();

export class TxProviderSyncService {
  constructor(
    private readonly providerBaseUrl =
      process.env.GAME_TX_PROVIDER_URL ?? 'https://txserver.site/huidu.php',
    private readonly txService = new TransactionService()
  ) {}

  private buildProviderUrl(sbmId: string, fromMs?: number): string {
    const base = this.providerBaseUrl.replace(/\/$/, '');
    const separator = base.includes('?') ? '&' : '?';
    let url = `${base}${separator}user=${encodeURIComponent(sbmId)}`;
    if (fromMs != null && fromMs > 0) {
      url += `&from=${fromMs}`;
    }
    return url;
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

  private markerFromMs(marker: IngestMarker): number | undefined {
    if (!marker.lastTimestamp) return undefined;
    const parsed = Number(marker.lastTimestamp);
    if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
    return Math.max(0, parsed - 60_000);
  }

  private computeNetDelta(records: ProviderRecord[]): number {
    return records.reduce((sum, r) => {
      const bet = Number(r.bet_amount ?? 0);
      const win = Number(r.win_amount ?? 0);
      return sum + (win - bet);
    }, 0);
  }

  private async fetchProviderRecords(
    sbmId: string,
    fromMs?: number
  ): Promise<{ records: ProviderRecord[]; totalRecords: number }> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch(this.buildProviderUrl(sbmId, fromMs), {
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

  private async loadBalanceContext(normalizedId: string) {
    const balanceDoc = await UserBalance.findOne({ id: normalizedId })
      .select('currentBalance gameIngestMarker walletRevision')
      .lean();

    const todayUTC = this.todayUtc();
    let marker = this.readMarker(balanceDoc?.gameIngestMarker);
    if (marker.date !== todayUTC) {
      marker = { date: todayUTC, lastTimestamp: '', lastSerial: '' };
    }

    return {
      currentBalance: Number(balanceDoc?.currentBalance ?? 0),
      walletRevision: Number(balanceDoc?.walletRevision ?? 0),
      marker,
      fromMs: this.markerFromMs(marker),
    };
  }

  private filterNewRecords(vendorRecords: ProviderRecord[], marker: IngestMarker) {
    return vendorRecords.filter((r) =>
      this.isRecordNewer(
        String(r.timestamp ?? ''),
        String(r.serial_number ?? ''),
        marker.lastTimestamp,
        marker.lastSerial
      )
    );
  }

  async previewForUser(sbmId: string): Promise<PreviewSyncResult> {
    const normalizedId = sbmId.trim().toLowerCase();
    if (!normalizedId) {
      throw new Error('Member id is required for game sync');
    }

    const inflight = previewInflight.get(normalizedId);
    if (inflight) return inflight;

    const run = this.runPreviewForUser(normalizedId).finally(() => {
      previewInflight.delete(normalizedId);
    });
    previewInflight.set(normalizedId, run);
    return run;
  }

  private async runPreviewForUser(normalizedId: string): Promise<PreviewSyncResult> {
    const { currentBalance, walletRevision, marker, fromMs } =
      await this.loadBalanceContext(normalizedId);

    const { records: vendorRecords, totalRecords } = await this.fetchProviderRecords(
      normalizedId,
      fromMs
    );

    if (!vendorRecords.length) {
      return {
        estimatedBalance: currentBalance,
        netDelta: 0,
        newRecords: 0,
        providerTotal: totalRecords,
        currentBalance,
        syncToken: randomUUID(),
        walletRevision,
        syncedAt: new Date().toISOString(),
        skippedReason: 'no_provider_records',
      };
    }

    const newRecords = this.filterNewRecords(vendorRecords, marker);

    if (newRecords.length === 0) {
      return {
        estimatedBalance: currentBalance,
        netDelta: 0,
        newRecords: 0,
        providerTotal: totalRecords,
        currentBalance,
        syncToken: randomUUID(),
        walletRevision,
        syncedAt: new Date().toISOString(),
        skippedReason: 'no_new_records',
      };
    }

    const netDelta = this.computeNetDelta(newRecords);
    const estimatedBalance = +(currentBalance + netDelta).toFixed(2);
    const syncToken = randomUUID();

    persistJobs.set(syncToken, {
      syncToken,
      sbmId: normalizedId,
      status: 'queued',
      previewBalance: estimatedBalance,
      startedAt: new Date().toISOString(),
    });

    return {
      estimatedBalance,
      netDelta,
      newRecords: newRecords.length,
      providerTotal: totalRecords,
      currentBalance,
      syncToken,
      walletRevision,
      syncedAt: new Date().toISOString(),
    };
  }

  enqueuePersist(sbmId: string, syncToken?: string): { syncToken: string; status: string } {
    const normalizedId = sbmId.trim().toLowerCase();
    if (!normalizedId) {
      throw new Error('Member id is required for game sync');
    }

    const existingToken = persistByUser.get(normalizedId);
    if (existingToken) {
      const existingJob = persistJobs.get(existingToken);
      if (existingJob && (existingJob.status === 'queued' || existingJob.status === 'running')) {
        return { syncToken: existingToken, status: existingJob.status };
      }
    }

    const token = syncToken ?? randomUUID();
    if (!persistJobs.has(token)) {
      persistJobs.set(token, {
        syncToken: token,
        sbmId: normalizedId,
        status: 'queued',
        startedAt: new Date().toISOString(),
      });
    }

    persistByUser.set(normalizedId, token);

    const inflight = persistInflight.get(normalizedId);
    if (!inflight) {
      const job = this.runPersistForUser(normalizedId, token).finally(() => {
        persistInflight.delete(normalizedId);
      });
      persistInflight.set(normalizedId, job);
    }

    return { syncToken: token, status: 'queued' };
  }

  getPersistStatus(syncToken: string): PersistJobStatus | null {
    return persistJobs.get(syncToken) ?? null;
  }

  private async runPersistForUser(normalizedId: string, syncToken: string): Promise<void> {
    const job = persistJobs.get(syncToken);
    if (job) {
      job.status = 'running';
    }

    try {
      const result = await this.runSyncForUser(normalizedId, { urgent: true });
      const previewBalance = job?.previewBalance ?? result.currentBalance;
      const drift = Math.abs(result.currentBalance - previewBalance);

      if (job) {
        job.status = 'completed';
        job.dbBalance = result.currentBalance;
        job.drift = drift;
        job.completedAt = new Date().toISOString();
      }
    } catch (err: unknown) {
      if (job) {
        job.status = 'failed';
        job.error = err instanceof Error ? err.message : 'Persist failed';
        job.completedAt = new Date().toISOString();
      }
      throw err;
    }
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

  private async runSyncForUser(
    normalizedId: string,
    opts?: { urgent?: boolean }
  ): Promise<SyncUserResult> {
    const emptyStats = this.emptyIngestStats();
    const batchSize = opts?.urgent ? BATCH_SIZE_URGENT : BATCH_SIZE;
    const batchDelay = opts?.urgent ? 0 : BATCH_DELAY_MS;

    const { currentBalance, marker, fromMs } = await this.loadBalanceContext(normalizedId);

    const { records: vendorRecords, totalRecords } = await this.fetchProviderRecords(
      normalizedId,
      fromMs
    );

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
    const newRecords = this.filterNewRecords(vendorRecords, marker);

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

    for (let i = 0; i < sortedNew.length; i += batchSize) {
      const batch = sortedNew.slice(i, i + batchSize);
      const batchStats = await this.postIngestBatch(batch);
      stats = {
        accepted: stats.accepted + (batchStats.accepted ?? 0),
        duplicates: stats.duplicates + (batchStats.duplicates ?? 0),
        errors: stats.errors + (batchStats.errors ?? 0),
        balancesUpdated: stats.balancesUpdated + (batchStats.balancesUpdated ?? 0),
        skippedNoBalance: stats.skippedNoBalance + (batchStats.skippedNoBalance ?? 0),
      };

      const batchNewest = batch.reduce(
        (best, row) => {
          const ts = String(row.timestamp ?? '');
          const serial = String(row.serial_number ?? '');
          if (!best) return { ts, serial };
          if (ts > best.ts) return { ts, serial };
          if (ts === best.ts && serial > best.serial) return { ts, serial };
          return best;
        },
        null as { ts: string; serial: string } | null
      );

      const batchProcessed =
        (batchStats.accepted ?? 0) > 0 || (batchStats.duplicates ?? 0) > 0;
      if (batchNewest && batchProcessed) {
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

      if (batchDelay > 0 && i + batchSize < sortedNew.length) {
        await this.delay(batchDelay);
      }
    }

    const refreshed = await UserBalance.findOne({ id: normalizedId })
      .select('currentBalance')
      .lean();

    if (stats.accepted > 0 || stats.duplicates > 0) {
      const newest = sortedNew[0];
      const nextMarker: IngestMarker = {
        date: todayUTC,
        lastTimestamp: String(newest.timestamp ?? ''),
        lastSerial: String(newest.serial_number ?? ''),
      };
      await UserBalance.updateOne(
        { id: normalizedId },
        {
          $set: {
            lastGameSyncAt: new Date(),
            gameIngestMarker: nextMarker,
          },
        }
      ).catch(() => undefined);
    }

    return {
      providerTotal: totalRecords,
      newRecords: sortedNew.length,
      stats,
      currentBalance: Number(refreshed?.currentBalance ?? currentBalance),
      syncedAt: new Date().toISOString(),
    };
  }
}
