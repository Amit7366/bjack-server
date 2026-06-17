import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import AppError from '../errors/AppError';
import {
  normalizeRebateCategory,
  REBATE_CATEGORIES,
  type RebateCategory,
} from '../GameEligibility/gameType.util';
import { GameTxnRecord } from '../GameTxnRecords/models/GameTxnRecord';
import { UserBalance } from '../Transaction/userBalance.model';
import { REBATE_HISTORY_PAGE_SIZE, REBATE_ORDER_PREFIX, REBATE_RATE } from './rebate.constants';
import { dayKeyToOrderSuffix, getDayKey, getDayRange, parseDayKey } from './rebateDay.util';
import {
  allocateClaimToCategories,
  backfillClaimedCategoryAmounts,
  computeCategoryRemaining,
  emptyCategoryAmounts,
  type RebateCategoryAmounts,
} from './rebateAllocation.util';
import {
  RebateClaim,
  type RebateCategorySnapshot,
  type IRebateClaim,
} from './rebateClaim.model';

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function emptyBreakdown(): RebateCategorySnapshot {
  return {
    slot: { turnover: 0, rebate: 0 },
    live: { turnover: 0, rebate: 0 },
    sports: { turnover: 0, rebate: 0 },
    poker: { turnover: 0, rebate: 0 },
    fishing: { turnover: 0, rebate: 0 },
  };
}

async function aggregateTurnoverByCategory(
  userId: string,
  dayKey: string
): Promise<RebateCategorySnapshot> {
  const { start, end } = getDayRange(dayKey);
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
        gameType: {
          $ifNull: ['$gameInfo.game_type', ''],
        },
        gameTitle: {
          $ifNull: ['$gameInfo.game_name', '$gameInfo.title'],
        },
        vendorCode: {
          $ifNull: ['$gameInfo.vendorCode', '$gameInfo.provider'],
        },
      },
    },
  ]);

  const breakdown = emptyBreakdown();

  for (const row of rows) {
    const category = normalizeRebateCategory(
      row.gameType,
      row.gameTitle,
      row.vendorCode
    );
    const bet = Number(row.bet ?? 0);
    if (!Number.isFinite(bet) || bet <= 0) continue;
    breakdown[category].turnover = roundMoney(breakdown[category].turnover + bet);
  }

  for (const cat of REBATE_CATEGORIES) {
    breakdown[cat].rebate = roundMoney(breakdown[cat].turnover * REBATE_RATE);
  }

  return breakdown;
}

function sumBreakdownRebate(breakdown: RebateCategorySnapshot): number {
  return roundMoney(REBATE_CATEGORIES.reduce((sum, cat) => sum + breakdown[cat].rebate, 0));
}

function sumBreakdownTurnover(breakdown: RebateCategorySnapshot): number {
  return roundMoney(REBATE_CATEGORIES.reduce((sum, cat) => sum + breakdown[cat].turnover, 0));
}

function primaryCategoryFromAmounts(amounts: RebateCategoryAmounts): RebateCategory {
  let best: RebateCategory = 'slot';
  let bestRebate = -1;
  for (const cat of REBATE_CATEGORIES) {
    const rebate = amounts[cat];
    if (rebate > bestRebate) {
      bestRebate = rebate;
      best = cat;
    }
  }
  return best;
}

async function getClaimedForDay(
  userId: string,
  dayKey: string,
  session?: mongoose.ClientSession
): Promise<number> {
  const query = RebateClaim.aggregate([
    { $match: { userId: new Types.ObjectId(userId), dayKey } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  if (session) query.session(session);
  const [row] = await query;
  return roundMoney(Number(row?.total ?? 0));
}

async function getClaimedPerCategoryForDay(
  userId: string,
  dayKey: string,
  session?: mongoose.ClientSession
): Promise<RebateCategoryAmounts> {
  const query = RebateClaim.find({
    userId: new Types.ObjectId(userId),
    dayKey,
  }).lean();
  if (session) query.session(session);
  const claims = await query;

  const totals = emptyCategoryAmounts();
  for (const claim of claims) {
    const amounts = backfillClaimedCategoryAmounts(claim);
    for (const cat of REBATE_CATEGORIES) {
      totals[cat] = roundMoney(totals[cat] + amounts[cat]);
    }
  }
  return totals;
}

async function buildRebateState(
  userId: string,
  dayKey: string,
  session?: mongoose.ClientSession
) {
  const earned = await aggregateTurnoverByCategory(userId, dayKey);
  const claimedPerCategory = await getClaimedPerCategoryForDay(userId, dayKey, session);
  const remaining = computeCategoryRemaining(earned, claimedPerCategory);
  const totalTurnover = sumBreakdownTurnover(earned);
  const totalEarnedRebate = sumBreakdownRebate(earned);
  const claimedToday = await getClaimedForDay(userId, dayKey, session);
  const claimable = sumBreakdownRebate(remaining);

  return {
    earned,
    claimedPerCategory,
    remaining,
    totalTurnover,
    totalEarnedRebate,
    claimedToday,
    claimable,
  };
}

async function buildManualSummary(
  userId: string,
  dayKey: string,
  session?: mongoose.ClientSession
) {
  const state = await buildRebateState(userId, dayKey, session);

  return {
    dayKey,
    date: dayKey,
    categories: state.remaining,
    totalTurnover: state.totalTurnover,
    totalEarnedRebate: state.totalEarnedRebate,
    claimedToday: state.claimedToday,
    claimable: state.claimable,
    canClaim: state.claimable > 0,
  };
}

async function generateOrderNo(
  userId: string,
  dayKey: string,
  session: mongoose.ClientSession
): Promise<string> {
  const count = await RebateClaim.countDocuments({
    userId: new Types.ObjectId(userId),
    dayKey,
  }).session(session);
  const suffix = dayKeyToOrderSuffix(dayKey);
  return `${REBATE_ORDER_PREFIX}${suffix}${String(count + 1).padStart(3, '0')}`;
}

export async function getManualRebate(userId: string, day?: string) {
  const dayKey = parseDayKey(day);
  if (dayKey !== getDayKey() && dayKey > getDayKey()) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Cannot view rebate for a future date');
  }
  return buildManualSummary(userId, dayKey);
}

export async function claimDailyRebate(userId: string) {
  const dayKey = getDayKey();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const state = await buildRebateState(userId, dayKey, session);
    if (state.claimable <= 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'No rebate available to claim');
    }

    const orderNo = await generateOrderNo(userId, dayKey, session);
    const claimedCategoryAmounts = allocateClaimToCategories(
      state.claimable,
      state.remaining
    );
    const primaryCategory = primaryCategoryFromAmounts(claimedCategoryAmounts);

    const [claim] = await RebateClaim.create(
      [
        {
          userId: new Types.ObjectId(userId),
          dayKey,
          orderNo,
          amount: state.claimable,
          primaryCategory,
          categoryBreakdown: state.earned,
          claimedCategoryAmounts,
          totalTurnover: state.totalTurnover,
          totalEarnedRebate: state.totalEarnedRebate,
          claimedBefore: state.claimedToday,
        },
      ],
      { session }
    );

    const updatedBalance = await UserBalance.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      {
        $inc: {
          currentBalance: state.claimable,
          walletRevision: 1,
        },
      },
      { new: true, session, upsert: false }
    );

    if (!updatedBalance) {
      throw new AppError(httpStatus.NOT_FOUND, 'User balance not found');
    }

    await session.commitTransaction();

    return {
      claim: formatClaimRecord(claim),
      balance: Number(updatedBalance.currentBalance).toFixed(2),
      summary: await buildManualSummary(userId, dayKey),
    };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

function formatClaimRecord(
  doc: IRebateClaim & { _id?: Types.ObjectId; createdAt?: Date }
) {
  return {
    id: String(doc._id),
    orderNo: doc.orderNo,
    dayKey: doc.dayKey,
    amount: doc.amount,
    primaryCategory: doc.primaryCategory,
    categoryBreakdown: doc.categoryBreakdown,
    totalTurnover: doc.totalTurnover,
    totalEarnedRebate: doc.totalEarnedRebate,
    claimedBefore: doc.claimedBefore,
    createdAt: doc.createdAt?.toISOString?.() ?? new Date().toISOString(),
  };
}

export async function getRebateHistory(
  userId: string,
  from?: string,
  to?: string,
  page = 1
) {
  const safePage = Math.max(1, page);
  const limit = REBATE_HISTORY_PAGE_SIZE;
  const skip = (safePage - 1) * limit;

  const fromKey = from && /^\d{4}-\d{2}-\d{2}$/.test(from) ? from : getDayKey();
  const toKey = to && /^\d{4}-\d{2}-\d{2}$/.test(to) ? to : fromKey;
  const startKey = fromKey <= toKey ? fromKey : toKey;
  const endKey = fromKey <= toKey ? toKey : fromKey;

  const { start } = getDayRange(startKey);
  const { end } = getDayRange(endKey);

  const filter = {
    userId: new Types.ObjectId(userId),
    createdAt: { $gte: start, $lte: end },
  };

  const [items, total] = await Promise.all([
    RebateClaim.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    RebateClaim.countDocuments(filter),
  ]);

  return {
    from: startKey,
    to: endKey,
    page: safePage,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    items: items.map((doc) =>
      formatClaimRecord({
        ...doc,
        _id: doc._id,
        createdAt: (doc as { createdAt?: Date }).createdAt,
      } as IRebateClaim & { _id: Types.ObjectId; createdAt?: Date })
    ),
  };
}
