import { randomUUID } from 'crypto';
import { UserBalance } from '../../Transaction/userBalance.model';

type IngestStats = {
  accepted: number;
  duplicates: number;
  errors: number;
  balancesUpdated: number;
  skippedNoBalance: number;
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

const syncInflight = new Map<string, Promise<SyncUserResult>>();
const previewInflight = new Map<string, Promise<PreviewSyncResult>>();
const persistInflight = new Map<string, Promise<void>>();
const persistJobs = new Map<string, PersistJobStatus>();
const persistByUser = new Map<string, string>();

export class TxProviderSyncService {
  private emptyIngestStats(): IngestStats {
    return {
      accepted: 0,
      duplicates: 0,
      errors: 0,
      balancesUpdated: 0,
      skippedNoBalance: 0,
    };
  }

  private async loadBalanceContext(normalizedId: string) {
    const balanceDoc = await UserBalance.findOne({ id: normalizedId })
      .select('currentBalance walletRevision')
      .lean();

    return {
      currentBalance: Number(balanceDoc?.currentBalance ?? 0),
      walletRevision: Number(balanceDoc?.walletRevision ?? 0),
    };
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
    // Cron (`apivexoTxnIngest`) owns vendor fetch + ingest.
    // Game-return only reads current UserBalance from Mongo (no huidu.php).
    const { currentBalance, walletRevision } = await this.loadBalanceContext(normalizedId);
    const syncToken = randomUUID();

    persistJobs.set(syncToken, {
      syncToken,
      sbmId: normalizedId,
      status: 'queued',
      previewBalance: currentBalance,
      startedAt: new Date().toISOString(),
    });

    return {
      estimatedBalance: currentBalance,
      netDelta: 0,
      newRecords: 0,
      providerTotal: 0,
      currentBalance,
      syncToken,
      walletRevision,
      syncedAt: new Date().toISOString(),
      skippedReason: 'no_new_records',
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
      const result = await this.runSyncForUser(normalizedId);
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

  private async runSyncForUser(normalizedId: string): Promise<SyncUserResult> {
    // Cron owns inserts; game-return persist only refreshes DB balance.
    const emptyStats = this.emptyIngestStats();
    const { currentBalance } = await this.loadBalanceContext(normalizedId);

    await UserBalance.updateOne(
      { id: normalizedId },
      { $set: { lastGameSyncAt: new Date() } }
    ).catch(() => undefined);

    const refreshed = await UserBalance.findOne({ id: normalizedId })
      .select('currentBalance')
      .lean();

    return {
      providerTotal: 0,
      newRecords: 0,
      stats: emptyStats,
      currentBalance: Number(refreshed?.currentBalance ?? currentBalance),
      syncedAt: new Date().toISOString(),
      skippedReason: 'no_new_records',
    };
  }
}
