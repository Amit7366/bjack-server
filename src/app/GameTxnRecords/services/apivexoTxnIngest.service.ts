import os from 'os';
import { randomUUID } from 'crypto';
import {
  APIVEXO_INGEST_CURSOR_ID,
  IngestCursor,
} from '../models/IngestCursor';
import { ProviderRecord } from '../types/provider';
import { TransactionService } from './transaction.service';

const OVERLAP_MS = 3 * 60 * 1000;
const FIRST_LOOKBACK_MS = 24 * 60 * 60 * 1000;
const PAGE_LIMIT = 50;
const MAX_PAGES_PER_TICK = 200;
const LEASE_MS = 2 * 60 * 1000;
const FETCH_TIMEOUT_MS = 45_000;

function fetchUrl() {
  return (
    process.env.GAME_TX_FETCH_URL ||
    'https://apivexo.com/api/game/v1/transactions/fetch'
  );
}

function apiSecret() {
  return process.env.GAME_API_SECRET || '';
}

function apiPrefix() {
  return process.env.GAME_API_PREFIX || '';
}

type ApivexoTxnItem = {
  id?: string;
  agency_uid?: string;
  serial_number?: string;
  currency_code?: string;
  game_uid?: string;
  member_account?: string;
  bet_amount?: string | number;
  win_amount?: string | number;
  timestamp?: string;
  game_round?: string;
};

type ApivexoFetchResponse = {
  success?: boolean;
  message?: string;
  data?: {
    items?: ApivexoTxnItem[];
    pagination?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    };
  };
};

export type ApivexoIngestTickResult = {
  skipped?: 'disabled' | 'no_credentials' | 'lease' | 'in_flight';
  pages?: number;
  fetched?: number;
  truncated?: boolean;
  accepted?: number;
  duplicates?: number;
  errors?: number;
  skippedNoBalance?: number;
  fromDate?: string;
  toDate?: string;
};

const txService = new TransactionService();
let tickInFlight = false;

const pad2 = (n: number) => String(n).padStart(2, '0');

export function formatUtcDateTime(d: Date): string {
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())} ${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}:${pad2(d.getUTCSeconds())}`;
}

function parseCursorTimestamp(value: string): Date | null {
  const d = new Date(`${value.trim().replace(' ', 'T')}Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isNewerRecord(
  ts: string,
  serial: string,
  lastTs: string | null,
  lastSerial: string | null,
): boolean {
  if (!lastTs) return true;
  if (ts > lastTs) return true;
  if (ts < lastTs) return false;
  if (!lastSerial) return true;
  return serial > lastSerial;
}

function mapItem(item: ApivexoTxnItem): ProviderRecord | null {
  const serial = String(item.serial_number ?? '').trim();
  const member = String(item.member_account ?? '').trim();
  const gameUid = String(item.game_uid ?? '').trim();
  const timestamp = String(item.timestamp ?? '').trim();
  if (!serial || !member || !gameUid || !timestamp) return null;

  return {
    serial_number: serial,
    currency_code: String(item.currency_code ?? 'BDT').trim() || 'BDT',
    game_uid: gameUid,
    member_account: member,
    bet_amount: item.bet_amount ?? 0,
    win_amount: item.win_amount ?? 0,
    timestamp,
    game_round: item.game_round ? String(item.game_round) : undefined,
    agency_uid: item.agency_uid ? String(item.agency_uid) : undefined,
  };
}

async function ensureCursor() {
  await IngestCursor.updateOne(
    { _id: APIVEXO_INGEST_CURSOR_ID },
    {
      $setOnInsert: {
        lastTimestamp: null,
        lastSerial: null,
        leaseUntil: null,
        leaseOwner: null,
      },
    },
    { upsert: true },
  );
}

async function acquireLease(owner: string, now: Date) {
  await ensureCursor();
  return IngestCursor.findOneAndUpdate(
    {
      _id: APIVEXO_INGEST_CURSOR_ID,
      $or: [{ leaseUntil: null }, { leaseUntil: { $lte: now } }],
    },
    {
      $set: {
        leaseOwner: owner,
        leaseUntil: new Date(now.getTime() + LEASE_MS),
      },
    },
    { new: true },
  ).lean();
}

async function releaseLease(
  owner: string,
  cursor?: { lastTimestamp: string | null; lastSerial: string | null },
) {
  const set: Record<string, unknown> = {
    leaseOwner: null,
    leaseUntil: null,
  };
  if (cursor) {
    set.lastTimestamp = cursor.lastTimestamp;
    set.lastSerial = cursor.lastSerial;
  }
  await IngestCursor.updateOne(
    { _id: APIVEXO_INGEST_CURSOR_ID, leaseOwner: owner },
    { $set: set },
  );
}

async function fetchPage(
  fromDate: string,
  toDate: string,
  page: number,
): Promise<ApivexoFetchResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(fetchUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiSecret: apiSecret(),
        prefix: apiPrefix(),
        fromDate,
        toDate,
        page,
        limit: PAGE_LIMIT,
      }),
      signal: controller.signal,
    });
    const json = (await res.json().catch(() => ({}))) as ApivexoFetchResponse;
    if (!res.ok || json.success === false) {
      throw new Error(json.message || `Apivexo fetch failed (${res.status})`);
    }
    return json;
  } finally {
    clearTimeout(timer);
  }
}

export async function runApivexoTxnIngestTick(): Promise<ApivexoIngestTickResult> {
  if (process.env.GAME_TX_CRON_ENABLED === 'false') {
    return { skipped: 'disabled' };
  }
  if (!apiSecret() || !apiPrefix()) {
    return { skipped: 'no_credentials' };
  }
  if (tickInFlight) {
    return { skipped: 'in_flight' };
  }

  tickInFlight = true;
  const owner = `${os.hostname()}:${process.pid}:${randomUUID()}`;
  const now = new Date();

  try {
    const leased = await acquireLease(owner, now);
    if (!leased) {
      return { skipped: 'lease' };
    }

    const toDate = formatUtcDateTime(now);
    const lastTs = leased.lastTimestamp;
    const fromBase = lastTs ? parseCursorTimestamp(lastTs) : null;
    const fromDate = formatUtcDateTime(
      new Date(
        (fromBase?.getTime() ?? now.getTime() - FIRST_LOOKBACK_MS) - OVERLAP_MS,
      ),
    );

    let page = 1;
    let totalPages = 1;
    let fetched = 0;
    let truncated = false;
    let accepted = 0;
    let duplicates = 0;
    let errors = 0;
    let skippedNoBalance = 0;
    let newestTs = lastTs;
    let newestSerial = leased.lastSerial;

    while (page <= totalPages && page <= MAX_PAGES_PER_TICK) {
      const json = await fetchPage(fromDate, toDate, page);
      const items = json.data?.items ?? [];
      totalPages = Math.max(1, Number(json.data?.pagination?.totalPages ?? 1));

      const records: ProviderRecord[] = [];
      for (const item of items) {
        const mapped = mapItem(item);
        if (!mapped) {
          errors++;
          continue;
        }
        fetched++;
        if (isNewerRecord(mapped.timestamp, mapped.serial_number, newestTs, newestSerial)) {
          newestTs = mapped.timestamp;
          newestSerial = mapped.serial_number;
        }
        records.push(mapped);
      }

      if (records.length > 0) {
        const stats = await txService.ingest({ records });
        accepted += stats.accepted ?? 0;
        duplicates += stats.duplicates ?? 0;
        errors += stats.errors ?? 0;
        skippedNoBalance += stats.skippedNoBalance ?? 0;
      }

      page += 1;
    }

    if (page <= totalPages) {
      truncated = true;
    }

    const advanceCursor = !truncated;
    await releaseLease(
      owner,
      advanceCursor
        ? { lastTimestamp: newestTs ?? null, lastSerial: newestSerial ?? null }
        : undefined,
    );

    return {
      pages: page - 1,
      fetched,
      truncated,
      accepted,
      duplicates,
      errors,
      skippedNoBalance,
      fromDate,
      toDate,
    };
  } catch (err) {
    await releaseLease(owner).catch(() => undefined);
    throw err;
  } finally {
    tickInFlight = false;
  }
}
