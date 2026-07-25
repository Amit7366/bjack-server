import {
  GgrBalance,
  GGR_BALANCE_KEY,
  GGR_DEFAULT_TOTAL,
  GGR_DEFAULT_USED,
  GGR_LOSS_FEE_RATE,
  GGR_WARNING_THRESHOLD,
  IGgrBalance,
} from '../models/GgrBalance';

export type GgrBalanceView = {
  totalGgr: number;
  usedGgr: number;
  remainingGgr: number;
  warning: boolean;
};

function toView(doc: Pick<IGgrBalance, 'totalGgr' | 'usedGgr'>): GgrBalanceView {
  const totalGgr = Number(doc.totalGgr) || 0;
  const usedGgr = Number(doc.usedGgr) || 0;
  const remainingGgr = totalGgr - usedGgr;
  return {
    totalGgr,
    usedGgr,
    remainingGgr,
    warning: remainingGgr <= GGR_WARNING_THRESHOLD,
  };
}

/** Ensure the singleton GGR balance doc exists (seed defaults on first create). */
export async function ensureGgrBalance(): Promise<IGgrBalance> {
  const existing = await GgrBalance.findOne({ key: GGR_BALANCE_KEY }).lean();
  if (existing) return existing as IGgrBalance;

  try {
    const created = await GgrBalance.create({
      key: GGR_BALANCE_KEY,
      totalGgr: GGR_DEFAULT_TOTAL,
      usedGgr: GGR_DEFAULT_USED,
    });
    return created.toObject();
  } catch (err: unknown) {
    const dup = err as { code?: number };
    if (dup?.code === 11000) {
      const again = await GgrBalance.findOne({ key: GGR_BALANCE_KEY }).lean();
      if (again) return again as IGgrBalance;
    }
    throw err;
  }
}

export async function getGgrBalance(): Promise<GgrBalanceView> {
  const doc = await ensureGgrBalance();
  return toView(doc);
}

/**
 * Sum used-GGR fee for newly inserted docs: 10% of bet when loss (win <= 0).
 * Wins (win > 0) do not increase used GGR.
 */
export function sumUsedGgrDelta(
  docs: Array<{ bet?: number; win?: number }>
): number {
  let total = 0;
  for (const d of docs) {
    const bet = +(d.bet ?? 0);
    const win = +(d.win ?? 0);
    if (win > 0 || !(bet > 0)) continue;
    total += bet * GGR_LOSS_FEE_RATE;
  }
  return total;
}

/** Atomically increase usedGgr. No-op when delta <= 0. */
export async function applyUsedGgrIncrement(delta: number): Promise<number> {
  if (!(delta > 0)) return 0;
  await ensureGgrBalance();
  await GgrBalance.updateOne(
    { key: GGR_BALANCE_KEY },
    { $inc: { usedGgr: delta } }
  );
  return delta;
}
