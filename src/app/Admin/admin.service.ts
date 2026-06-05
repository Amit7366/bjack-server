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

  for (const bonus of referralBonuses) {
    const required = Number(bonus.turnoverRequired || 0);
    let completed = Number(bonus.turnoverCompleted || 0);

    if (!bonus.isCompleted && required > 0 && completed >= required) {
      await ReferralBonusTracking.updateOne(
        { _id: bonus._id },
        { $set: { isCompleted: true, turnoverCompleted: required } }
      );
      bonus.isCompleted = true;
      completed = required;
    }

    addPendingProgress({
      id: String(bonus._id),
      kind: 'referral',
      label: 'Referral bonus',
      turnoverRequired: required,
      turnoverCompleted: completed,
      isCompleted: Boolean(bonus.isCompleted),
    });
  }

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
}

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
  getUsersWithHighBalanceFromDB
};
