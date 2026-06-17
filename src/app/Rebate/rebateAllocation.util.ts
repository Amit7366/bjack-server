import { REBATE_CATEGORIES, type RebateCategory } from '../GameEligibility/gameType.util';
import type { RebateCategorySnapshot } from './rebateClaim.model';

export type RebateCategoryAmounts = Record<RebateCategory, number>;

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function emptyCategoryAmounts(): RebateCategoryAmounts {
  return {
    slot: 0,
    live: 0,
    sports: 0,
    poker: 0,
    fishing: 0,
  };
}

export function sumCategoryAmounts(amounts: RebateCategoryAmounts): number {
  return roundMoney(REBATE_CATEGORIES.reduce((sum, cat) => sum + amounts[cat], 0));
}

/** Remaining claimable rebate per category from earned minus already claimed. */
export function computeCategoryRemaining(
  earned: RebateCategorySnapshot,
  claimedPerCategory: RebateCategoryAmounts
): RebateCategorySnapshot {
  const remaining = {} as RebateCategorySnapshot;
  for (const cat of REBATE_CATEGORIES) {
    const rebate = roundMoney(
      Math.max(0, earned[cat].rebate - claimedPerCategory[cat])
    );
    remaining[cat] = { turnover: 0, rebate };
  }
  return remaining;
}

/**
 * Split claimAmount across categories proportionally to their remaining rebates.
 * Uses largest-remainder rounding so the parts sum exactly to claimAmount.
 */
export function allocateClaimToCategories(
  claimAmount: number,
  categoryRemaining: RebateCategorySnapshot
): RebateCategoryAmounts {
  const amount = roundMoney(claimAmount);
  if (amount <= 0) return emptyCategoryAmounts();

  const weights = REBATE_CATEGORIES.map((cat) => ({
    cat,
    weight: categoryRemaining[cat].rebate,
  })).filter((row) => row.weight > 0);

  const totalWeight = roundMoney(weights.reduce((sum, row) => sum + row.weight, 0));
  if (totalWeight <= 0) return emptyCategoryAmounts();

  const raw = weights.map((row) => ({
    cat: row.cat,
    exact: (amount * row.weight) / totalWeight,
    floored: 0,
    remainder: 0,
  }));

  let allocated = 0;
  for (const row of raw) {
    row.floored = Math.floor(row.exact * 100) / 100;
    row.remainder = row.exact - row.floored;
    allocated = roundMoney(allocated + row.floored);
  }

  let centsLeft = Math.round((amount - allocated) * 100);
  raw.sort((a, b) => b.remainder - a.remainder);
  for (const row of raw) {
    if (centsLeft <= 0) break;
    row.floored = roundMoney(row.floored + 0.01);
    centsLeft -= 1;
  }

  const result = emptyCategoryAmounts();
  for (const row of raw) {
    result[row.cat] = row.floored;
  }
  return result;
}

/** Backfill allocation for legacy claims missing claimedCategoryAmounts. */
export function backfillClaimedCategoryAmounts(claim: {
  amount: number;
  categoryBreakdown?: RebateCategorySnapshot;
  claimedCategoryAmounts?: RebateCategoryAmounts;
}): RebateCategoryAmounts {
  if (claim.claimedCategoryAmounts) {
    return claim.claimedCategoryAmounts;
  }

  const breakdown = claim.categoryBreakdown;
  if (!breakdown) {
    return emptyCategoryAmounts();
  }

  return allocateClaimToCategories(claim.amount, breakdown);
}
