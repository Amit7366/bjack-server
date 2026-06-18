import httpStatus from 'http-status';
import { Types } from 'mongoose';
import AppError from '../errors/AppError';
import {
  normalizeRebateCategory,
  REBATE_CATEGORIES,
  type RebateCategory,
} from '../GameEligibility/gameType.util';
import { GameTxnRecord } from '../GameTxnRecords/models/GameTxnRecord';
import { Transaction } from '../Transaction/transaction.model';
import { LoginBonusTracking } from '../User/loginBonusTracking.model';
import { SignupBonusTracking } from '../User/signupBonusTracking.model';
import { WeeklyRewardModel } from '../WeeklyReward/models/weeklyReward.model';
import {
  allocateClaimToCategories,
  backfillClaimedCategoryAmounts,
  emptyCategoryAmounts,
  type RebateCategoryAmounts,
} from '../Rebate/rebateAllocation.util';
import { RebateClaim, type RebateCategorySnapshot } from '../Rebate/rebateClaim.model';
import { getDayKey, getDayRange } from '../Rebate/rebateDay.util';

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export type CategoryGameMetrics = {
  betting: number;
  validBet: number;
  winAmount: number;
  rebate: number;
  bonus: number;
  pnl: number;
};

export type AllSummaryMetrics = {
  deposit: number;
  withdrawal: number;
  bonus: number;
  rebate: number;
  income: number;
  expense: number;
  pnl: number;
};

export type PersonalReport = {
  from: string;
  to: string;
  all: AllSummaryMetrics;
  categories: Record<RebateCategory, CategoryGameMetrics>;
};

function emptyCategoryBetting(): RebateCategoryAmounts {
  return emptyCategoryAmounts();
}

function bettingSnapshot(weights: RebateCategoryAmounts): RebateCategorySnapshot {
  const snapshot = {} as RebateCategorySnapshot;
  for (const cat of REBATE_CATEGORIES) {
    snapshot[cat] = { turnover: 0, rebate: weights[cat] };
  }
  return snapshot;
}

function allocateBonusByBetting(
  totalBonus: number,
  categoryBetting: RebateCategoryAmounts
): RebateCategoryAmounts {
  return allocateClaimToCategories(totalBonus, bettingSnapshot(categoryBetting));
}

function parseReportRange(from?: string, to?: string): { fromKey: string; toKey: string; start: Date; end: Date } {
  const today = getDayKey();
  const fromKey = from && /^\d{4}-\d{2}-\d{2}$/.test(from) ? from : today;
  const toKey = to && /^\d{4}-\d{2}-\d{2}$/.test(to) ? to : fromKey;
  const startKey = fromKey <= toKey ? fromKey : toKey;
  const endKey = fromKey <= toKey ? toKey : fromKey;

  if (endKey > today) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Cannot view report for a future date');
  }

  const { start } = getDayRange(startKey);
  const { end } = getDayRange(endKey);
  return { fromKey: startKey, toKey: endKey, start, end };
}

async function aggregateGameMetricsByCategory(
  userId: string,
  start: Date,
  end: Date
): Promise<{ betting: RebateCategoryAmounts; winAmount: RebateCategoryAmounts }> {
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

  const betting = emptyCategoryBetting();
  const winAmount = emptyCategoryBetting();

  for (const row of rows) {
    const category = normalizeRebateCategory(row.gameType, row.gameTitle, row.vendorCode);
    const bet = Number(row.bet ?? 0);
    const win = Number(row.win ?? 0);
    if (Number.isFinite(bet) && bet > 0) {
      betting[category] = roundMoney(betting[category] + bet);
    }
    if (Number.isFinite(win) && win > 0) {
      winAmount[category] = roundMoney(winAmount[category] + win);
    }
  }

  return { betting, winAmount };
}

async function aggregateWalletMetrics(
  userId: string,
  start: Date,
  end: Date
): Promise<{ deposit: number; withdrawal: number }> {
  const userObjectId = new Types.ObjectId(userId);
  const rows = await Transaction.aggregate([
    {
      $match: {
        userId: userObjectId,
        status: 'success',
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: '$transactionType',
        amount: { $sum: '$amount' },
      },
    },
  ]);

  let deposit = 0;
  let withdrawal = 0;
  for (const row of rows) {
    if (row._id === 'deposit') deposit = roundMoney(row.amount ?? 0);
    if (row._id === 'withdraw') withdrawal = roundMoney(row.amount ?? 0);
  }
  return { deposit, withdrawal };
}

async function aggregateRebateByCategory(
  userId: string,
  start: Date,
  end: Date
): Promise<{ byCategory: RebateCategoryAmounts; total: number }> {
  const claims = await RebateClaim.find({
    userId: new Types.ObjectId(userId),
    createdAt: { $gte: start, $lte: end },
  }).lean();

  const byCategory = emptyCategoryBetting();
  let total = 0;

  for (const claim of claims) {
    const amounts = backfillClaimedCategoryAmounts(claim);
    total = roundMoney(total + Number(claim.amount ?? 0));
    for (const cat of REBATE_CATEGORIES) {
      byCategory[cat] = roundMoney(byCategory[cat] + amounts[cat]);
    }
  }

  return { byCategory, total };
}

async function aggregateBonusTotal(userId: string, start: Date, end: Date): Promise<number> {
  const userObjectId = new Types.ObjectId(userId);

  const [loginBonusAgg, depositBonusAgg, signupBonusAgg, weeklyBonusAgg] = await Promise.all([
    LoginBonusTracking.aggregate([
      {
        $match: {
          userId: userObjectId,
          createdAt: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: null, total: { $sum: '$bonusAmount' } } },
    ]),
    Transaction.aggregate([
      {
        $match: {
          userId: userObjectId,
          status: 'success',
          transactionType: 'deposit',
          createdAt: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: null, total: { $sum: { $ifNull: ['$bonusAmount', 0] } } } },
    ]),
    SignupBonusTracking.aggregate([
      {
        $match: {
          userId: userObjectId,
          createdAt: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: null, total: { $sum: '$bonusAmount' } } },
    ]),
    WeeklyRewardModel.aggregate([
      {
        $match: {
          userId: userObjectId,
          isClaimed: true,
          updatedAt: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: null, total: { $sum: '$cashbackAmount' } } },
    ]),
  ]);

  const total = roundMoney(
    Number(loginBonusAgg[0]?.total ?? 0) +
      Number(depositBonusAgg[0]?.total ?? 0) +
      Number(signupBonusAgg[0]?.total ?? 0) +
      Number(weeklyBonusAgg[0]?.total ?? 0)
  );

  return total;
}

export async function getPersonalReport(
  userId: string,
  from?: string,
  to?: string
): Promise<PersonalReport> {
  const { fromKey, toKey, start, end } = parseReportRange(from, to);

  const [game, wallet, rebate, bonusTotal] = await Promise.all([
    aggregateGameMetricsByCategory(userId, start, end),
    aggregateWalletMetrics(userId, start, end),
    aggregateRebateByCategory(userId, start, end),
    aggregateBonusTotal(userId, start, end),
  ]);

  const bonusByCategory = allocateBonusByBetting(bonusTotal, game.betting);

  const categories = {} as Record<RebateCategory, CategoryGameMetrics>;
  let totalBetting = 0;
  let totalWin = 0;

  for (const cat of REBATE_CATEGORIES) {
    const betting = game.betting[cat];
    const win = game.winAmount[cat];
    const rebateAmt = rebate.byCategory[cat];
    const bonus = bonusByCategory[cat];
    const pnl = roundMoney(win + rebateAmt + bonus - betting);

    categories[cat] = {
      betting,
      validBet: betting,
      winAmount: win,
      rebate: rebateAmt,
      bonus,
      pnl,
    };

    totalBetting = roundMoney(totalBetting + betting);
    totalWin = roundMoney(totalWin + win);
  }

  const expense = totalBetting;
  const income = roundMoney(totalWin + bonusTotal + rebate.total);
  const allPnl = roundMoney(income - expense);

  return {
    from: fromKey,
    to: toKey,
    all: {
      deposit: wallet.deposit,
      withdrawal: wallet.withdrawal,
      bonus: bonusTotal,
      rebate: rebate.total,
      income,
      expense,
      pnl: allPnl,
    },
    categories,
  };
}
