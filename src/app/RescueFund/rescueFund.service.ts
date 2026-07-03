import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import AppError from '../errors/AppError';
import {
  normalizeRebateCategory,
  type RebateCategory,
} from '../GameEligibility/gameType.util';
import { GameTxnRecord } from '../GameTxnRecords/models/GameTxnRecord';
import { getDayKey, getDayRange, parseDayKey } from '../Rebate/rebateDay.util';
import { Transaction } from '../Transaction/transaction.model';
import { LoginBonusTracking } from '../User/loginBonusTracking.model';
import { UserBalance } from '../Transaction/userBalance.model';
import {
  LOSS_COMPENSATION_TIERS,
  RESCUE_FUND_TURNOVER_MULTIPLIER,
  RESCUE_FUND_VARIANTS,
  SPORTS_BONUS_RATE,
  SPORTS_MIN_NET_LOSS,
  type LossCompensationTier,
  type RescueFundVariant,
} from './rescueFund.constants';
import { RescueFundClaim, type IRescueFundClaim } from './rescueFundClaim.model';

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function variantCategories(variant: RescueFundVariant): RebateCategory[] {
  if (variant === 'sports') return ['sports'];
  return ['slot', 'fishing'];
}

function assertVariant(value: string): RescueFundVariant {
  if ((RESCUE_FUND_VARIANTS as readonly string[]).includes(value)) {
    return value as RescueFundVariant;
  }
  throw new AppError(httpStatus.BAD_REQUEST, 'Invalid rescue fund type');
}

async function aggregateVariantMetrics(
  userId: string,
  variant: RescueFundVariant,
  start: Date,
  end: Date
): Promise<{ totalBet: number; totalWin: number; totalLoss: number }> {
  const allowed = new Set(variantCategories(variant));
  const userObjectId = new Types.ObjectId(userId);

  const rows = await GameTxnRecord.aggregate([
    {
      $match: {
        userId: userObjectId,
        providerTsUtc: { $gte: start, $lte: end },
      },
    },
    {
      $lookup: {
        from: 'gamecatalogs',
        let: { uid: '$gameUid' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [{ $eq: ['$gameCode', '$$uid'] }, { $eq: ['$tileId', '$$uid'] }],
              },
            },
          },
          { $limit: 1 },
        ],
        as: 'gameInfo',
      },
    },
    {
      $unwind: {
        path: '$gameInfo',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        bet: 1,
        win: 1,
        gameType: { $ifNull: ['$gameInfo.game_type', ''] },
        gameTitle: { $ifNull: ['$gameInfo.game_name', '$gameInfo.title'] },
        vendorCode: { $ifNull: ['$gameInfo.vendorCode', '$gameInfo.provider'] },
      },
    },
  ]);

  let totalBet = 0;
  let totalWin = 0;

  for (const row of rows) {
    const category = normalizeRebateCategory(row.gameType, row.gameTitle, row.vendorCode);
    if (!allowed.has(category)) continue;

    const bet = Number(row.bet ?? 0);
    const win = Number(row.win ?? 0);
    if (Number.isFinite(bet) && bet > 0) totalBet = roundMoney(totalBet + bet);
    if (Number.isFinite(win) && win > 0) totalWin = roundMoney(totalWin + win);
  }

  const totalLoss = roundMoney(Math.max(0, totalBet - totalWin));
  return { totalBet, totalWin, totalLoss };
}

async function aggregateDepositForDay(
  userId: string,
  start: Date,
  end: Date
): Promise<number> {
  const [row] = await Transaction.aggregate([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        status: 'success',
        transactionType: 'deposit',
        createdAt: { $gte: start, $lte: end },
      },
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  return roundMoney(Number(row?.total ?? 0));
}

function computeSportsReceivable(totalLoss: number): number {
  if (totalLoss <= SPORTS_MIN_NET_LOSS) return 0;
  return roundMoney(Math.floor(totalLoss * SPORTS_BONUS_RATE));
}

function resolveLossCompensationTier(totalLoss: number): LossCompensationTier | null {
  let matched: LossCompensationTier | null = null;
  for (const tier of LOSS_COMPENSATION_TIERS) {
    if (totalLoss >= tier.minNetLoss) matched = tier;
  }
  return matched;
}

function computeReceivable(variant: RescueFundVariant, totalLoss: number): number {
  if (variant === 'sports') return computeSportsReceivable(totalLoss);
  return resolveLossCompensationTier(totalLoss)?.bonus ?? 0;
}

function formatTierRow(tier: LossCompensationTier, depositAmount: number) {
  return {
    deposit: depositAmount.toFixed(2),
    netLoss: `≥${tier.minNetLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    bonus: String(tier.bonus),
    points: '',
    ticket: '',
    minNetLoss: tier.minNetLoss,
  };
}

export type RescueFundStatus = {
  variant: RescueFundVariant;
  dayKey: string;
  totalLoss: number;
  receivableAmount: number;
  claimedAmount: number;
  claimable: number;
  canClaim: boolean;
  depositAmount: number;
  totalBet: number;
  totalWin: number;
  sportsRules: {
    minNetLoss: number;
    bonusRatePercent: number;
    depositAmount: number;
    netLossThreshold: string;
    bonusRate: string;
    pointRate: string;
    ticket: string;
  } | null;
  lossCompensationTiers: ReturnType<typeof formatTierRow>[];
  qualifiedTierMinNetLoss: number | null;
};

async function getClaimForDay(
  userId: string,
  variant: RescueFundVariant,
  dayKey: string,
  session?: mongoose.ClientSession
) {
  const query = RescueFundClaim.findOne({
    userId: new Types.ObjectId(userId),
    variant,
    dayKey,
  }).lean();
  if (session) query.session(session);
  return query;
}

export async function getRescueFundStatus(
  userId: string,
  variantInput: string,
  day?: string
): Promise<RescueFundStatus> {
  const variant = assertVariant(variantInput);
  const dayKey = parseDayKey(day);
  if (dayKey > getDayKey()) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Cannot view rescue fund for a future date');
  }

  const { start, end } = getDayRange(dayKey);
  const [{ totalBet, totalWin, totalLoss }, depositAmount, claim] = await Promise.all([
    aggregateVariantMetrics(userId, variant, start, end),
    aggregateDepositForDay(userId, start, end),
    getClaimForDay(userId, variant, dayKey),
  ]);

  const receivableAmount = computeReceivable(variant, totalLoss);
  const claimedAmount = roundMoney(Number(claim?.claimedAmount ?? 0));
  const claimable = roundMoney(Math.max(0, receivableAmount - claimedAmount));
  const canClaim = claimable > 0;

  const qualifiedTier = variant === 'loss-compensation'
    ? resolveLossCompensationTier(totalLoss)
    : null;

  return {
    variant,
    dayKey,
    totalLoss,
    receivableAmount,
    claimedAmount,
    claimable,
    canClaim,
    depositAmount,
    totalBet,
    totalWin,
    sportsRules:
      variant === 'sports'
        ? {
            minNetLoss: SPORTS_MIN_NET_LOSS,
            bonusRatePercent: SPORTS_BONUS_RATE * 100,
            depositAmount,
            netLossThreshold: `>${SPORTS_MIN_NET_LOSS.toFixed(2)}`,
            bonusRate: String(SPORTS_BONUS_RATE * 100),
            pointRate: '',
            ticket: '',
          }
        : null,
    lossCompensationTiers: LOSS_COMPENSATION_TIERS.map((tier) =>
      formatTierRow(tier, depositAmount)
    ),
    qualifiedTierMinNetLoss: qualifiedTier?.minNetLoss ?? null,
  };
}

export async function claimRescueFund(userId: string, variantInput: string) {
  const variant = assertVariant(variantInput);
  const dayKey = getDayKey();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const status = await getRescueFundStatus(userId, variant, dayKey);
    if (!status.canClaim || status.claimable <= 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'No rescue fund reward available to claim');
    }

    const existing = await getClaimForDay(userId, variant, dayKey, session);
    if (existing) {
      throw new AppError(httpStatus.CONFLICT, 'Rescue fund reward already claimed for today');
    }

    const bonusAmount = status.claimable;
    const turnoverRequired = roundMoney(bonusAmount * RESCUE_FUND_TURNOVER_MULTIPLIER);

    const [claim] = await RescueFundClaim.create(
      [
        {
          userId: new Types.ObjectId(userId),
          variant,
          dayKey,
          totalLoss: status.totalLoss,
          receivableAmount: status.receivableAmount,
          claimedAmount: bonusAmount,
          depositAmount: status.depositAmount,
          totalBet: status.totalBet,
          totalWin: status.totalWin,
          turnoverRequired,
        },
      ],
      { session }
    );

    await LoginBonusTracking.create(
      [
        {
          userId: new Types.ObjectId(userId),
          bonusAmount,
          depositAmount: 0,
          turnoverRequired,
          turnoverCompleted: 0,
          isCompleted: false,
        },
      ],
      { session }
    );

    const updatedBalance = await UserBalance.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      {
        $inc: {
          currentBalance: bonusAmount,
          walletRevision: 1,
        },
      },
      { new: true, session }
    );

    if (!updatedBalance) {
      throw new AppError(httpStatus.NOT_FOUND, 'User balance not found');
    }

    await session.commitTransaction();

    return {
      claim: formatClaim(claim),
      balance: Number(updatedBalance.currentBalance).toFixed(2),
      status: await getRescueFundStatus(userId, variant, dayKey),
    };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

function formatClaim(doc: IRescueFundClaim & { _id?: Types.ObjectId; createdAt?: Date }) {
  return {
    id: String(doc._id),
    variant: doc.variant,
    dayKey: doc.dayKey,
    claimedAmount: doc.claimedAmount,
    totalLoss: doc.totalLoss,
    receivableAmount: doc.receivableAmount,
    turnoverRequired: doc.turnoverRequired,
    createdAt: doc.createdAt?.toISOString?.() ?? new Date().toISOString(),
  };
}

export async function countClaimableRescueFunds(userId: string): Promise<number> {
  const results = await Promise.all(
    RESCUE_FUND_VARIANTS.map((variant) => getRescueFundStatus(userId, variant))
  );
  return results.filter((row) => row.canClaim).length;
}
