import { REBATE_TZ } from '../Rebate/rebate.constants';

export const RESCUE_FUND_TZ = REBATE_TZ;
export const RESCUE_FUND_TURNOVER_MULTIPLIER = 3;

export const RESCUE_FUND_VARIANTS = ['sports', 'loss-compensation'] as const;
export type RescueFundVariant = (typeof RESCUE_FUND_VARIANTS)[number];

export const SPORTS_MIN_NET_LOSS = 1;
export const SPORTS_BONUS_RATE = 0.1;

export type LossCompensationTier = {
  minNetLoss: number;
  bonus: number;
};

export const LOSS_COMPENSATION_TIERS: LossCompensationTier[] = [
  { minNetLoss: 100, bonus: 5 },
  { minNetLoss: 500, bonus: 25 },
  { minNetLoss: 1000, bonus: 50 },
  { minNetLoss: 3000, bonus: 150 },
];
