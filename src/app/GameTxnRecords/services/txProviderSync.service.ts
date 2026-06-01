import { UserBalance } from '../../Transaction/userBalance.model';
import { TransactionService } from './transaction.service';
import type { ProviderRecord } from '../types/provider';

type TxServerResponse = {
  status?: boolean;
  message?: string;
  total_records?: number;
  data?: ProviderRecord[];
};

export type SyncUserResult = {
  providerTotal: number;
  stats: {
    accepted: number;
    duplicates: number;
    errors: number;
    balancesUpdated: number;
    skippedNoBalance: number;
  };
  currentBalance: number;
  syncedAt: string;
};

/**
 * Pulls only the user's pending rows from txserver, ingests new txnIds,
 * applies net (win - bet) deltas to UserBalance — no full history load.
 */
export class TxProviderSyncService {
  constructor(
    private readonly txService = new TransactionService(),
    private readonly providerBaseUrl =
      process.env.GAME_TX_PROVIDER_URL ?? 'https://txserver.site/testIndex.php'
  ) {}

  private buildProviderUrl(sbmId: string): string {
    const base = this.providerBaseUrl.replace(/\/$/, '');
    const separator = base.includes('?') ? '&' : '?';
    return `${base}${separator}user=${encodeURIComponent(sbmId)}`;
  }

  async syncForUser(sbmId: string): Promise<SyncUserResult> {
    const normalizedId = sbmId.trim().toLowerCase();
    if (!normalizedId) {
      throw new Error('Member id is required for game sync');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);

    let records: ProviderRecord[] = [];
    try {
      const response = await fetch(this.buildProviderUrl(normalizedId), {
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

      records = Array.isArray(json.data) ? json.data : [];
    } finally {
      clearTimeout(timeout);
    }

    let stats = {
      accepted: 0,
      duplicates: 0,
      errors: 0,
      balancesUpdated: 0,
      skippedNoBalance: 0,
    };

    if (records.length > 0) {
      stats = await this.txService.ingest({ data: records });
    }

    const balanceDoc = await UserBalance.findOne({ id: normalizedId })
      .select('currentBalance')
      .lean();

    const currentBalance = Number(balanceDoc?.currentBalance ?? 0);

    await UserBalance.updateOne(
      { id: normalizedId },
      { $set: { lastGameSyncAt: new Date() } }
    ).catch(() => {
      /* optional field — ignore if schema lacks it */
    });

    return {
      providerTotal: records.length,
      stats,
      currentBalance,
      syncedAt: new Date().toISOString(),
    };
  }
}
