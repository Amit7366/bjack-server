export const SPIN_TZ = 'Asia/Dhaka';

/** 1× turnover on spin win amount */
export const SPIN_TURNOVER_MULTIPLIER = 1;

/** Visual wheel segments (amounts in TK). Duplicates allow varied layout while server picks by weight. */
export const SPIN_WHEEL_SEGMENTS: readonly { amount: number; weight: number }[] = [
  { amount: 5, weight: 22 },
  { amount: 7, weight: 18 },
  { amount: 10, weight: 16 },
  { amount: 15, weight: 14 },
  { amount: 17, weight: 12 },
  { amount: 22, weight: 10 },
  { amount: 25, weight: 8 },
  { amount: 10, weight: 5 },
  { amount: 15, weight: 4 },
  { amount: 7, weight: 3 },
] as const;

export const SPIN_SEGMENT_COUNT = SPIN_WHEEL_SEGMENTS.length;

export const SPIN_ALLOWED_AMOUNTS = [...new Set(SPIN_WHEEL_SEGMENTS.map((s) => s.amount))].sort(
  (a, b) => a - b
);
