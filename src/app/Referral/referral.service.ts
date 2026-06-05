import mongoose, { Types } from "mongoose";
import { ReferralModel } from "../Referral/referral.model";
import { ReferralRewardModel } from "../ReferralRewardTracker/referralReward.model";
import { ReferralBonusTracking } from "../ReferralRewardTracker/referralBonusTracking.model";
import { NormalUser } from "../NormalUser/normalUser.model";
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

export type MyReferralSummary = {
  referralId: string;
  activeDownline: number;
  inviteCount: number;
  totalRewards: number;
  downlineTurnover: number;
  rewards: number;
  earnedReward: number;
};

export const getMyReferralSummary = async (userId: string): Promise<MyReferralSummary> => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user id");
  }

  const userObjectId = new Types.ObjectId(userId);

  const [normalUser, reward, bonusAgg] = await Promise.all([
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
  };
};
