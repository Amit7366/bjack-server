import mongoose, { Types } from "mongoose";
import { ReferralModel } from "../Referral/referral.model";
import { ReferralRewardModel } from "../ReferralRewardTracker/referralReward.model";
import { ReferralBonusTracking } from "../ReferralRewardTracker/referralBonusTracking.model";
import { NormalUser } from "../NormalUser/normalUser.model";
import { User } from "../User/user.model";
import { UserBalance } from "../Transaction/userBalance.model";
import AppError from "../errors/AppError";
import httpStatus from "http-status";

/**
 * Record a referral pair at sign-up.
 * - Idempotent: won’t create duplicates.
 * - Ensures a reward summary doc for the referrer.
 * - Increments totalReferred **only** on first insert.
 * - No bonus credit here; payout happens in releaseReferralBonuses on first deposit.
 */
export const trackReferral = async (
  referredUserId: string,
  referrerId: string,
  externalSession?: mongoose.ClientSession
) => {
  const session = externalSession || await mongoose.startSession();
  let ownSession = false;
  if (!externalSession) {
    session.startTransaction();
    ownSession = true;
  }

  try {
    // 1) Insert the pair once (idempotent)
    const upsertRes = await ReferralModel.updateOne(
      { referredUser: referredUserId },
      { $setOnInsert: { referredUser: referredUserId, referrer: referrerId } },
      { upsert: true, session }
    );

    // was this the first time we inserted this pair?
    const firstInsert = (upsertRes as any).upsertedCount === 1 || (upsertRes as any).upsertedId;

    // 2) Ensure summary exists
    await ReferralRewardModel.updateOne(
      { referrer: referrerId },
      {
        $setOnInsert: {
          referrer: referrerId,
          totalReferred: 0,
          totalPendingTK: 0,
          totalPendingCoin: 0,
          totalReleasedTK: 0,
          totalReleasedCoin: 0,
        },
      },
      { upsert: true, session }
    );

    // 3) Only bump totalReferred on first insert of the pair
    if (firstInsert) {
      await ReferralRewardModel.updateOne(
        { referrer: referrerId },
        { $inc: { totalReferred: 1 } },
        { session }
      );
    }

    if (ownSession) await session.commitTransaction();
  } catch (err) {
    if (ownSession) await session.abortTransaction();
    throw err;
  } finally {
    if (ownSession) session.endSession();
  }
};

export type ReferredUserRow = {
  userId: string;
  username: string;
  totalDeposit: number;
  referredAt: string;
};

export type MyReferralSummary = {
  referralId: string;
  activeDownline: number;
  inviteCount: number;
  totalRewards: number;
  downlineTurnover: number;
  rewards: number;
  earnedReward: number;
  referredUsers: ReferredUserRow[];
};

export const getMyReferredUsers = async (userId: string): Promise<ReferredUserRow[]> => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user id");
  }

  const referrerObjectId = new Types.ObjectId(userId);

  const referrals = await ReferralModel.find({ referrer: referrerObjectId })
    .sort({ referredAt: -1 })
    .lean();

  if (!referrals.length) return [];

  const referredIds = referrals.map((r) => r.referredUser);

  const [users, balances, normalUsers] = await Promise.all([
    User.find({ _id: { $in: referredIds } }).select("userName id").lean(),
    UserBalance.find({ userId: { $in: referredIds } }).select("userId totalDeposit").lean(),
    NormalUser.find({ user: { $in: referredIds } }).select("user userName id").lean(),
  ]);

  const usernameByUserId = new Map<string, string>();
  for (const u of users) {
    usernameByUserId.set(String(u._id), u.userName ?? u.id ?? "—");
  }
  for (const nu of normalUsers) {
    const key = String(nu.user);
    if (!usernameByUserId.has(key) || usernameByUserId.get(key) === "—") {
      usernameByUserId.set(key, nu.userName ?? nu.id ?? "—");
    }
  }

  const depositByUserId = new Map(
    balances.map((b) => [String(b.userId), Number(b.totalDeposit ?? 0)])
  );

  return referrals.map((r) => {
    const referredUserId = String(r.referredUser);
    return {
      userId: referredUserId,
      username: usernameByUserId.get(referredUserId) ?? "—",
      totalDeposit: depositByUserId.get(referredUserId) ?? 0,
      referredAt: (r.referredAt ?? new Date()).toISOString(),
    };
  });
};

export const getMyReferralSummary = async (userId: string): Promise<MyReferralSummary> => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user id");
  }

  const userObjectId = new Types.ObjectId(userId);

  const [normalUser, reward, bonusAgg, referredUsers] = await Promise.all([
    NormalUser.findOne({ user: userObjectId }).select("referralId refferCount").lean(),
    ReferralRewardModel.findOne({ referrer: userObjectId }).lean(),
    ReferralBonusTracking.aggregate<{ turnoverCompleted: number; earnedBonus: number }>([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: null,
          turnoverCompleted: { $sum: "$turnoverCompleted" },
          earnedBonus: {
            $sum: { $cond: ["$isCompleted", "$bonusAmount", 0] },
          },
        },
      },
    ]),
    getMyReferredUsers(userId),
  ]);

  if (!normalUser?.referralId) {
    throw new AppError(httpStatus.NOT_FOUND, "Referral profile not found");
  }

  const bonus = bonusAgg[0];
  const inviteCount = reward?.totalReferred ?? normalUser.refferCount ?? 0;
  const pendingRewards = reward?.totalPendingTK ?? 0;

  return {
    referralId: normalUser.referralId,
    activeDownline: normalUser.refferCount ?? inviteCount,
    inviteCount,
    totalRewards: pendingRewards,
    downlineTurnover: bonus?.turnoverCompleted ?? 0,
    rewards: pendingRewards,
    earnedReward: bonus?.earnedBonus ?? 0,
    referredUsers,
  };
};
