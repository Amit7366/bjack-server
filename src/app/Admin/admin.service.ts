/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import { AdminSearchableFields } from './admin.constant';
import { TAdmin } from './admin.interface';
import { Admin } from './admin.model';
import AppError from '../errors/AppError';
import { User } from '../User/user.model';
import QueryBuilder from '../builder/QueryBuilder';
import { TurnoverTracking } from '../UserPromotion/turnoverTracking.model';

import { SignupBonusTracking } from '../User/signupBonusTracking.model';
import { LoginBonusTracking } from '../User/loginBonusTracking.model';
import { ReferralBonusTracking } from '../ReferralRewardTracker/referralBonusTracking.model';
import { UserBalance } from '../Transaction/userBalance.model';
import { NormalUser } from '../NormalUser/normalUser.model';
interface ITransactionFilter {
  type?: string;
  transactionType?: string;
}
// ⬇ added: realtime + Redis session helpers

import { GameTxnRecord } from '../GameTxnRecords/models/GameTxnRecord';
import { Transaction } from '../Transaction/transaction.model';
import { TurnoverActivity } from '../Turnover/turnover.model';
import { BetTransaction } from '../Transaction/betTransaction.model';
import { getMyReferralSummary } from '../Referral/referral.service';
import { ReferralModel } from '../Referral/referral.model';

// ───────────────────────────────────────────────────────────────────────────────
// Admin list/search
// ───────────────────────────────────────────────────────────────────────────────
const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(
    Admin.find({ isDeleted: false }).select(
      '_id id user designation name gender dateOfBirth email contactNo emergencyContactNo bloodGroup presentAddress permanentAddress profileImg isDeleted'
    ),
    query
  )
    .search(AdminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await adminQuery.modelQuery;
  const meta = await adminQuery.countTotal();
  return { result, meta };
};

const getSingleAdminFromDB = async (id: string) => {
  const result = await Admin.findById(id);
  return result;
};

const updateAdminIntoDB = async (id: string, payload: Partial<TAdmin>) => {
  const { name, ...remainingAdminData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = { ...remainingAdminData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Admin.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteAdminFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedAdmin = await Admin.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );
    if (!deletedAdmin) throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete admin');

    const userId = deletedAdmin.user;
    const deletedUser = await User.findByIdAndDelete(userId, { session });
    if (!deletedUser) throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');

    await session.commitTransaction();
    await session.endSession();

    return deletedAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

// ───────────────────────────────────────────────────────────────────────────────
// Promotion summary (read-only)
// ───────────────────────────────────────────────────────────────────────────────
const getUserPromotionSummary = async (userId: string) => {
  const objectUserId = new Types.ObjectId(userId);

  const txnAgg = await GameTxnRecord.aggregate([
    { $match: { userId: objectUserId } },
    {
      $group: {
        _id: null,
        totalTurnover: { $sum: '$bet' },
      },
    },
  ]);

  const actualBetTurnover = Number(txnAgg[0]?.totalTurnover || 0);

  const [depositBonuses, signupBonus, referralBonuses, loginBonuses] =
    await Promise.all([
      TurnoverTracking.find({ userId }).sort({ createdAt: -1 }),
      SignupBonusTracking.findOne({ userId }),
      ReferralBonusTracking.find({ userId }),
      LoginBonusTracking.find({ userId }),
    ]);

  type ProgressItem = {
    id: string;
    kind: 'deposit' | 'signup' | 'referral' | 'login';
    label: string;
    turnoverRequired: number;
    turnoverCompleted: number;
    remaining: number;
    isCompleted: boolean;
    promoCode?: string;
    eligibleGameTypes?: string[];
    isActive?: boolean;
  };

  const progressItems: ProgressItem[] = [];
  let totalRequired = 0;
  let totalCompleted = 0;
  let totalRemaining = 0;

  const addPendingProgress = (
    item: Omit<ProgressItem, 'remaining'> & { remaining?: number }
  ) => {
    const required = Number(item.turnoverRequired || 0);
    const completed = Number(item.turnoverCompleted || 0);
    const remaining = Math.max(0, required - completed);
    if (item.isCompleted || required <= 0) return;

    progressItems.push({ ...item, turnoverRequired: required, turnoverCompleted: completed, remaining });
    totalRequired += required;
    totalCompleted += completed;
    totalRemaining += remaining;
  };

  for (const bonus of depositBonuses) {
    const required = Number(bonus.turnoverRequired || 0);
    let completed = Number(bonus.turnoverCompleted || 0);

    if (!bonus.isCompleted && required > 0 && completed >= required) {
      await TurnoverTracking.updateOne(
        { _id: bonus._id },
        {
          $set: {
            isCompleted: true,
            isActive: false,
            turnoverCompleted: required,
            eligibleGameTypes: ['none'],
            maxWithdraw: null,
          },
        }
      );
      bonus.isCompleted = true;
      bonus.isActive = false;
      completed = required;
    }

    addPendingProgress({
      id: String(bonus._id),
      kind: 'deposit',
      label: bonus.promoCode ? `Deposit (${bonus.promoCode})` : 'Deposit turnover',
      turnoverRequired: required,
      turnoverCompleted: completed,
      isCompleted: Boolean(bonus.isCompleted),
      promoCode: bonus.promoCode ?? undefined,
      eligibleGameTypes: bonus.eligibleGameTypes,
      isActive: Boolean(bonus.isActive),
    });
  }

  if (signupBonus) {
    const required = Number(signupBonus.turnoverRequired || 0);
    let completed = Number(signupBonus.turnoverCompleted || 0);

    if (!signupBonus.isCompleted && required > 0 && completed >= required) {
      await SignupBonusTracking.updateOne(
        { _id: signupBonus._id },
        { $set: { isCompleted: true, turnoverCompleted: required } }
      );
      signupBonus.isCompleted = true;
      completed = required;
    }

    addPendingProgress({
      id: String(signupBonus._id),
      kind: 'signup',
      label: 'Signup bonus',
      turnoverRequired: required,
      turnoverCompleted: completed,
      isCompleted: Boolean(signupBonus.isCompleted),
    });
  }

  // Referral turnover rewards are credited via LoginBonusTracking after referred user hits milestone.

  for (const bonus of loginBonuses) {
    const required = Number(bonus.turnoverRequired || 0);
    let completed = Number(bonus.turnoverCompleted || 0);

    if (!bonus.isCompleted && required > 0 && completed >= required) {
      await LoginBonusTracking.updateOne(
        { _id: bonus._id },
        { $set: { isCompleted: true, turnoverCompleted: required } }
      );
      bonus.isCompleted = true;
      completed = required;
    }

    addPendingProgress({
      id: String(bonus._id),
      kind: 'login',
      label: 'Login bonus',
      turnoverRequired: required,
      turnoverCompleted: completed,
      isCompleted: Boolean(bonus.isCompleted),
    });
  }

  const completionPercentage =
    totalRequired > 0
      ? parseFloat(((totalCompleted / totalRequired) * 100).toFixed(2))
      : totalRemaining === 0
        ? 100
        : 0;

  const activeDeposit =
    depositBonuses.find((b) => b.isActive && !b.isCompleted) ??
    depositBonuses.find((b) => !b.isCompleted) ??
    null;

  return {
    depositBonuses,
    signupBonus,
    referralBonuses,
    loginBonuses,
    totalTurnoverRequired: totalRemaining,
    totalTurnoverCompleted: totalCompleted,
    completionPercentage,
    actualBetTurnover,
    progress: {
      items: progressItems,
      totalRequired,
      totalCompleted,
      totalRemaining,
      completionPercentage,
      activeDeposit: activeDeposit
        ? {
            promoCode: activeDeposit.promoCode ?? undefined,
            turnoverRequired: Number(activeDeposit.turnoverRequired || 0),
            turnoverCompleted: Number(activeDeposit.turnoverCompleted || 0),
            remaining: Math.max(
              0,
              Number(activeDeposit.turnoverRequired || 0) -
                Number(activeDeposit.turnoverCompleted || 0)
            ),
            isCompleted: Boolean(activeDeposit.isCompleted),
            eligibleGameTypes: activeDeposit.eligibleGameTypes,
          }
        : null,
    },
  };
};



// ───────────────────────────────────────────────────────────────────────────────
// Signup bonus: Redis-first, idempotent, realtime
// ───────────────────────────────────────────────────────────────────────────────

// deterministic, idempotent key for the signup-bonus credit
const giveSignupBonus = async (userId: string, bonusAmount: number = 70) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  if (user.signupBonusGiven) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Signup bonus already given');
  }

  // Ensure user balance exists
  let ub = await UserBalance.findOne({ userId: user._id });
  if (!ub) {
    ub = await UserBalance.create({
      userId: user._id,
      currentBalance: 0,
      totalDeposit: 0,
      totalWithdraw: 0,
      currentCoinBalance: 0,
      totalCoinDeposit: 0,
      totalCoinWithdraw: 0,
      lockedBalance: 0,
      id: `sbm${Math.floor(10000 + Math.random() * 90000)}` // optional if you auto-generate IDs
    });
  }

  const bonus = Number(bonusAmount);
  const turnoverRequired = bonus * 3;

  // Find or create tracker
  let tracker = await SignupBonusTracking.findOne({ userId: user._id, isCompleted: false });
  if (!tracker) {
    tracker = await SignupBonusTracking.create({
      userId: user._id,
      bonusAmount: bonus,
      turnoverRequired,
      turnoverCompleted: 0,
      isCompleted: false,
    });
  } else {
    tracker.bonusAmount = bonus;
    tracker.turnoverRequired = turnoverRequired;
    await tracker.save();
  }

  // Update Mongo balance only
  const newBalance = (ub.currentBalance || 0) + bonus;

  const updatedBalance = await UserBalance.findOneAndUpdate(
    { userId: user._id },
    { $set: { currentBalance: newBalance }, storeDbBalance: bonus, },
    { new: true, upsert: true }
  );

  if (!updatedBalance) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update user balance');
  }

  // Mark as given
  await User.updateOne({ _id: user._id }, { $set: { signupBonusGiven: true } });
  await NormalUser.updateOne({ user: user._id }, { $set: { signupBonusGiven: true } });

  return {
    message: `Signup bonus of ${bonus} TK given successfully!`,
    balance: Number(updatedBalance.currentBalance).toFixed(2),
    turnoverRequired: tracker.turnoverRequired,
    trackerId: String(tracker._id),
  };
};



// ───────────────────────────────────────────────────────────────────────────────
// Misc admin utilities
// ───────────────────────────────────────────────────────────────────────────────
const updateUserStatus = async (userId: string, status: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  await User.updateOne({ _id: userId }, { $set: { status } });
  await NormalUser.updateOne({ user: userId }, { $set: { status } });
};

const assignCustomerOfficer = async (userId: string, officerId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  await User.updateOne(
    { _id: userId },
    {
      $set: {
        customerOfficerId: officerId,
        engagementStatus: 'booked',
      },
    }
  );

  await NormalUser.updateOne(
    { user: userId },
    {
      $set: {
        customerOfficerId: officerId,
        engagementStatus: 'booked',
      },
    }
  );
};

const getUsersAssignedToOfficer = async (officerId: string) => {
  return await User.find({ customerOfficerId: officerId });
};
const getSuccessfulTransactionRecordFromDB = async (filters: ITransactionFilter) => {
  const matchStage: Record<string, any> = {};

  // Always success
  if (filters.type === 'success') {
    matchStage.status = 'success';
  }

  // Filter by transactionType
  if (filters.transactionType) {
    matchStage.transactionType = filters.transactionType;
  } else {
    matchStage.transactionType = { $in: ['deposit', 'withdraw'] };
  }

  // ✅ Aggregation pipeline for cross-field match
  const result = await Transaction.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: 'normalusers', // 👈 collection name in MongoDB (check your actual collection name)
        localField: 'userId', // field in Transaction
        foreignField: 'user', // field in NormalUser
        as: 'userInfo',
      },
    },
    {
      $unwind: {
        path: '$userInfo',
        preserveNullAndEmptyArrays: true,
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  return result;
};

// ───────────────────────────────────────────────────────────────────────────────
// Dashboard overview
// ───────────────────────────────────────────────────────────────────────────────
function parseDashboardDateRange(from?: string, to?: string) {
  const toDate = to ? new Date(`${to}T23:59:59.999Z`) : new Date();
  toDate.setUTCHours(23, 59, 59, 999);

  const fromDate = from ? new Date(`${from}T00:00:00.000Z`) : new Date(toDate);
  if (!from) {
    fromDate.setDate(fromDate.getDate() - 6);
  }
  fromDate.setUTCHours(0, 0, 0, 0);

  const ms = toDate.getTime() - fromDate.getTime() + 1;
  const prevToDate = new Date(fromDate.getTime() - 1);
  const prevFromDate = new Date(prevToDate.getTime() - ms + 1);
  prevFromDate.setUTCHours(0, 0, 0, 0);
  prevToDate.setUTCHours(23, 59, 59, 999);

  return { fromDate, toDate, prevFromDate, prevToDate };
}

async function sumPendingTransactions(transactionType: 'deposit' | 'withdraw') {
  const [agg] = await Transaction.aggregate([
    { $match: { status: 'pending', transactionType } },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);
  return { count: agg?.count ?? 0, totalAmount: agg?.totalAmount ?? 0 };
}

async function paymentStats(fromDate: Date, toDate: Date) {
  const agg = await Transaction.aggregate([
    {
      $match: {
        status: 'success',
        createdAt: { $gte: fromDate, $lte: toDate },
      },
    },
    {
      $group: {
        _id: '$transactionType',
        count: { $sum: 1 },
        amount: { $sum: '$amount' },
        bonusPaid: { $sum: { $ifNull: ['$bonusAmount', 0] } },
      },
    },
  ]);

  const deposits = { count: 0, amount: 0 };
  const withdrawals = { count: 0, amount: 0 };
  let bonusPaid = 0;

  for (const row of agg ?? []) {
    if (row._id === 'deposit') {
      deposits.count = row.count;
      deposits.amount = row.amount;
      bonusPaid = row.bonusPaid ?? 0;
    } else if (row._id === 'withdraw') {
      withdrawals.count = row.count;
      withdrawals.amount = row.amount;
    }
  }

  const byMethodAgg = await Transaction.aggregate([
    {
      $match: {
        status: 'success',
        transactionType: 'deposit',
        createdAt: { $gte: fromDate, $lte: toDate },
      },
    },
    {
      $group: {
        _id: '$paymentMethod',
        amount: { $sum: '$amount' },
      },
    },
  ]);

  const byMethod: Record<string, number> = {};
  for (const row of byMethodAgg) {
    byMethod[String(row._id ?? 'unknown')] = row.amount ?? 0;
  }

  return { deposits, withdrawals, bonusPaid, byMethod };
}

async function gamingStats(fromDate: Date, toDate: Date) {
  const [gameAgg, betAgg] = await Promise.all([
    GameTxnRecord.aggregate([
      { $match: { providerTsUtc: { $gte: fromDate, $lte: toDate } } },
      {
        $group: {
          _id: null,
          turnover: { $sum: '$bet' },
          wins: { $sum: '$win' },
          activeBettors: { $addToSet: '$userId' },
        },
      },
      {
        $project: {
          turnover: 1,
          wins: 1,
          activeBettors: { $size: '$activeBettors' },
          ggr: { $subtract: ['$turnover', '$wins'] },
        },
      },
    ]),
    BetTransaction.aggregate([
      { $match: { createdAt: { $gte: fromDate, $lte: toDate } } },
      {
        $group: {
          _id: null,
          winCount: { $sum: { $cond: [{ $eq: ['$type', 'win'] }, 1, 0] } },
          loseCount: { $sum: { $cond: [{ $eq: ['$type', 'lose'] }, 1, 0] } },
          refundCount: { $sum: { $cond: [{ $eq: ['$type', 'refund'] }, 1, 0] } },
        },
      },
    ]),
  ]);

  const game = gameAgg[0] ?? { turnover: 0, wins: 0, ggr: 0, activeBettors: 0 };
  const bets = betAgg[0] ?? { winCount: 0, loseCount: 0, refundCount: 0 };

  const byGameType = await TurnoverActivity.aggregate([
    { $match: { timestamp: { $gte: fromDate, $lte: toDate } } },
    {
      $group: {
        _id: '$gameType',
        amount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { amount: -1 } },
  ]);

  return {
    turnover: game.turnover ?? 0,
    wins: game.wins ?? 0,
    ggr: game.ggr ?? 0,
    activeBettors: game.activeBettors ?? 0,
    winCount: bets.winCount ?? 0,
    loseCount: bets.loseCount ?? 0,
    refundCount: bets.refundCount ?? 0,
    byGameType: byGameType.map((row) => ({
      gameType: String(row._id ?? 'other'),
      amount: row.amount ?? 0,
      count: row.count ?? 0,
    })),
  };
}

async function trendStats(fromDate: Date, toDate: Date) {
  const [registrationsByDay, depositsByDay, withdrawalsByDay, ggrByDay] =
    await Promise.all([
      User.aggregate([
        {
          $match: {
            role: 'user',
            isDeleted: false,
            createdAt: { $gte: fromDate, $lte: toDate },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Transaction.aggregate([
        {
          $match: {
            status: 'success',
            transactionType: 'deposit',
            createdAt: { $gte: fromDate, $lte: toDate },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            amount: { $sum: '$amount' },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Transaction.aggregate([
        {
          $match: {
            status: 'success',
            transactionType: 'withdraw',
            createdAt: { $gte: fromDate, $lte: toDate },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            amount: { $sum: '$amount' },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      GameTxnRecord.aggregate([
        { $match: { providerTsUtc: { $gte: fromDate, $lte: toDate } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$providerTsUtc' } },
            bet: { $sum: '$bet' },
            win: { $sum: '$win' },
          },
        },
        {
          $project: {
            _id: 1,
            amount: { $subtract: ['$bet', '$win'] },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

  return {
    registrationsByDay: registrationsByDay.map((r) => ({
      date: r._id,
      count: r.count,
    })),
    depositsByDay: depositsByDay.map((r) => ({ date: r._id, amount: r.amount })),
    withdrawalsByDay: withdrawalsByDay.map((r) => ({
      date: r._id,
      amount: r.amount,
    })),
    ggrByDay: ggrByDay.map((r) => ({ date: r._id, amount: r.amount })),
  };
}

const getDashboardOverviewFromDB = async (from?: string, to?: string) => {
  const { fromDate, toDate, prevFromDate, prevToDate } = parseDashboardDateRange(from, to);

  const [
    pendingDeposits,
    pendingWithdrawals,
    pendingKyc,
    frozenAccounts,
    negativeBalanceUsers,
    totalUsers,
    newInPeriod,
    newPreviousPeriod,
    activeInPeriod,
    statusAgg,
    levelAgg,
    payments,
    paymentsPrevious,
    gaming,
    walletAgg,
    trends,
    pendingTxRows,
    newUserRows,
  ] = await Promise.all([
    sumPendingTransactions('deposit'),
    sumPendingTransactions('withdraw'),
    User.countDocuments({ kycStatus: 'pending', isDeleted: false }),
    User.countDocuments({ status: 'frozen', role: 'user', isDeleted: false }),
    UserBalance.countDocuments({ currentBalance: { $lt: 0 } }),
    User.countDocuments({ role: 'user', isDeleted: false }),
    User.countDocuments({
      role: 'user',
      isDeleted: false,
      createdAt: { $gte: fromDate, $lte: toDate },
    }),
    User.countDocuments({
      role: 'user',
      isDeleted: false,
      createdAt: { $gte: prevFromDate, $lte: prevToDate },
    }),
    User.countDocuments({
      role: 'user',
      isDeleted: false,
      lastActiveAt: { $gte: fromDate, $lte: toDate },
    }),
    User.aggregate([
      { $match: { role: 'user', isDeleted: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    User.aggregate([
      { $match: { role: 'user', isDeleted: false } },
      { $group: { _id: '$userLevel', count: { $sum: 1 } } },
    ]),
    paymentStats(fromDate, toDate),
    paymentStats(prevFromDate, prevToDate),
    gamingStats(fromDate, toDate),
    UserBalance.aggregate([
      {
        $group: {
          _id: null,
          totalBalance: { $sum: '$currentBalance' },
          lockedBalance: { $sum: { $ifNull: ['$lockedBalance', 0] } },
        },
      },
    ]),
    trendStats(fromDate, toDate),
    Transaction.find({ status: 'pending' })
      .populate('userId', 'userName id')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
    NormalUser.find({ isDeleted: false })
      .select('id userName createdAt kycVerified status')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  const byStatus: Record<string, number> = {};
  for (const row of statusAgg) {
    byStatus[String(row._id ?? 'unknown')] = row.count;
  }

  const byLevel: Record<string, number> = {};
  for (const row of levelAgg) {
    byLevel[String(row._id ?? 'Normal')] = row.count;
  }

  const wallet = walletAgg[0] ?? { totalBalance: 0, lockedBalance: 0 };

  return {
    period: {
      from: fromDate.toISOString().slice(0, 10),
      to: toDate.toISOString().slice(0, 10),
    },
    previousPeriod: {
      from: prevFromDate.toISOString().slice(0, 10),
      to: prevToDate.toISOString().slice(0, 10),
    },
    actionRequired: {
      pendingDeposits,
      pendingWithdrawals,
      pendingKyc: { count: pendingKyc },
      frozenAccounts: { count: frozenAccounts },
      negativeBalanceUsers: { count: negativeBalanceUsers },
    },
    users: {
      total: totalUsers,
      newInPeriod,
      newPreviousPeriod,
      activeInPeriod,
      byStatus,
      byLevel,
    },
    payments: {
      deposits: payments.deposits,
      depositsPrevious: paymentsPrevious.deposits,
      withdrawals: payments.withdrawals,
      withdrawalsPrevious: paymentsPrevious.withdrawals,
      netPosition: payments.deposits.amount - payments.withdrawals.amount,
      bonusPaid: payments.bonusPaid,
      byMethod: payments.byMethod,
    },
    gaming,
    wallet: {
      totalBalance: wallet.totalBalance ?? 0,
      lockedBalance: wallet.lockedBalance ?? 0,
    },
    trends,
    recent: {
      pendingTransactions: pendingTxRows.map((row: any) => ({
        _id: String(row._id),
        id: row.id,
        amount: row.amount,
        transactionType: row.transactionType,
        paymentMethod: row.paymentMethod,
        status: row.status,
        createdAt: row.createdAt,
        userName: row.userId?.userName,
        memberId: row.userId?.id ?? row.id,
      })),
      newUsers: newUserRows.map((row: any) => ({
        memberId: row.id,
        userName: row.userName,
        createdAt: row.createdAt,
        kycStatus: row.kycVerified ? 'approved' : 'pending',
        status: row.status,
      })),
    },
  };
};

const getAdvertiserDashboardOverviewFromDB = async (
  userId: string,
  from?: string,
  to?: string,
) => {
  const { fromDate, toDate } = parseDashboardDateRange(from, to);
  const summary = await getMyReferralSummary(userId);
  const referrerObjectId = new Types.ObjectId(userId);

  const [newInPeriod, referredIds] = await Promise.all([
    ReferralModel.countDocuments({
      referrer: referrerObjectId,
      referredAt: { $gte: fromDate, $lte: toDate },
    }),
    ReferralModel.find({ referrer: referrerObjectId }).select('referredUser').lean(),
  ]);

  const ids = referredIds.map((r) => r.referredUser);
  let activeReferred = 0;
  let ftdCount = 0;

  if (ids.length) {
    [activeReferred, ftdCount] = await Promise.all([
      User.countDocuments({
        _id: { $in: ids },
        lastActiveAt: { $gte: fromDate, $lte: toDate },
      }),
      UserBalance.countDocuments({
        userId: { $in: ids },
        totalDeposit: { $gt: 0 },
      }),
    ]);
  }

  return {
    period: {
      from: fromDate.toISOString().slice(0, 10),
      to: toDate.toISOString().slice(0, 10),
    },
    referralId: summary.referralId,
    inviteCount: summary.inviteCount,
    newInPeriod,
    activeReferred,
    ftdCount,
    earnedReward: summary.earnedReward,
    pendingRewards: summary.totalRewards,
    downlineTurnover: summary.downlineTurnover,
    referredUsers: summary.referredUsers.slice(0, 10),
  };
};

const getUsersWithHighBalanceFromDB = async () => {
  const result = await UserBalance.aggregate([
    {
      $match: {
        currentBalance: { $lt: 0 }, // 👈 changed from $gt to $lt
      },
    },
    {
      $lookup: {
        from: 'normalusers', // MongoDB collection name
        localField: 'userId', // field in UserBalance
        foreignField: 'user', // field in NormalUser
        as: 'userInfo',
      },
    },
    {
      $unwind: {
        path: '$userInfo',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: { currentBalance: 1 }, // optional: lowest balance first
    },
  ]);

  return result;
};

export const AdminServices = {
  getAllAdminsFromDB,
  getSingleAdminFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB,
  getUserPromotionSummary,
  giveSignupBonus,          // ⬅ updated
  updateUserStatus,
  assignCustomerOfficer,
  getUsersAssignedToOfficer,
  getSuccessfulTransactionRecordFromDB,
  getUsersWithHighBalanceFromDB,
  getDashboardOverviewFromDB,
  getAdvertiserDashboardOverviewFromDB,
};
