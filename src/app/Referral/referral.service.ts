import mongoose, { Types } from "mongoose";
import { ReferralModel } from "../Referral/referral.model";
import { ReferralRewardModel } from "../ReferralRewardTracker/referralReward.model";
import { ReferralBonusTracking } from "../ReferralRewardTracker/referralBonusTracking.model";
import {
  ensureReferralTurnoverTracking,
  payReferralTurnoverRewards,
} from "../ReferralRewardTracker/referralTurnoverReward.util";
import { applyTemuReferralBoost } from "../TemuTicket/temuTicket.service";
import { REFERRED_TURNOVER_THRESHOLD } from "../ReferralRewardTracker/referralTurnoverReward.constants";
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
 * - No bonus credit here; payout happens automatically when referred user completes turnover.
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

    if (firstInsert) {
      await ensureReferralTurnoverTracking(referredUserId);
      await applyTemuReferralBoost(referrerId).catch(() => undefined);
    }
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
  turnoverCompleted: number;
  turnoverRequired: number;
  rewardPaid: boolean;
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

/** Exact, case-insensitive match for referral codes like AD-0007 */
export const referredByMatchFilter = (referralId: string) => {
  const escaped = referralId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return { referredBy: { $regex: new RegExp(`^${escaped}$`, "i") } };
};

/**
 * Resolve referred member userIds for a referrer.
 * Merges Referral collection pairs with NormalUser/User.referredBy === referralId
 * so advertisers (and legacy data) still show when Referral rows are missing.
 */
export const resolveReferredUserIds = async (
  referrerUserId: string,
  referralId?: string | null,
): Promise<{ userId: Types.ObjectId; referredAt: Date }[]> => {
  const referrerObjectId = new Types.ObjectId(referrerUserId);

  let code = referralId?.trim() || null;
  if (!code) {
    const referrer = await User.findById(referrerObjectId).select("referralId").lean();
    code = referrer?.referralId?.trim() || null;
  }

  const [referrals, byNormalUser, byUser] = await Promise.all([
    ReferralModel.find({ referrer: referrerObjectId })
      .select("referredUser referredAt")
      .lean(),
    code
      ? NormalUser.find(referredByMatchFilter(code))
          .select("user createdAt")
          .lean()
      : Promise.resolve([]),
    code
      ? User.find({
          ...referredByMatchFilter(code),
          _id: { $ne: referrerObjectId },
        })
          .select("_id createdAt")
          .lean()
      : Promise.resolve([]),
  ]);

  const byId = new Map<string, Date>();

  for (const r of referrals) {
    const id = String(r.referredUser);
    byId.set(id, r.referredAt ? new Date(r.referredAt) : new Date());
  }

  for (const nu of byNormalUser) {
    const id = String(nu.user);
    if (!byId.has(id)) {
      const createdAt =
        (nu as { createdAt?: Date }).createdAt ?? new Date();
      byId.set(id, new Date(createdAt));
    }
  }

  for (const u of byUser) {
    const id = String(u._id);
    if (!byId.has(id)) {
      const createdAt =
        (u as { createdAt?: Date }).createdAt ?? new Date();
      byId.set(id, new Date(createdAt));
    }
  }

  return [...byId.entries()]
    .map(([id, referredAt]) => ({
      userId: new Types.ObjectId(id),
      referredAt,
    }))
    .sort((a, b) => b.referredAt.getTime() - a.referredAt.getTime());
};

export const getMyReferredUsers = async (userId: string): Promise<ReferredUserRow[]> => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user id");
  }

  const referrerObjectId = new Types.ObjectId(userId);
  const [resolved, referrerUser] = await Promise.all([
    resolveReferredUserIds(userId),
    User.findById(referrerObjectId).select("role").lean(),
  ]);

  if (!resolved.length) return [];

  const referredIds = resolved.map((r) => r.userId);
  const referredIdStrings = referredIds.map((id) => String(id));

  // Member referral TK payouts need UserBalance. Advertisers use partner commission —
  // never run payout side-effects on their dashboard read path.
  const isAdvertiser = referrerUser?.role === "advertiser";
  if (!isAdvertiser) {
    await Promise.all(referredIdStrings.map((id) => ensureReferralTurnoverTracking(id)));
    await payReferralTurnoverRewards(referredIdStrings).catch(() => undefined);
  }

  const [users, balances, normalUsers, turnoverTrackers] = await Promise.all([
    User.find({ _id: { $in: referredIds } }).select("userName id").lean(),
    UserBalance.find({ userId: { $in: referredIds } }).select("userId totalDeposit").lean(),
    NormalUser.find({ user: { $in: referredIds } }).select("user userName id").lean(),
    ReferralBonusTracking.find({
      userId: referrerObjectId,
      referredUserId: { $in: referredIds },
    })
      .select("referredUserId turnoverCompleted turnoverRequired rewardPaid")
      .lean(),
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

  const turnoverByReferredId = new Map(
    turnoverTrackers.map((t) => [
      String(t.referredUserId),
      {
        turnoverCompleted: Number(t.turnoverCompleted ?? 0),
        turnoverRequired: Number(t.turnoverRequired ?? REFERRED_TURNOVER_THRESHOLD),
        rewardPaid: Boolean(t.rewardPaid),
      },
    ])
  );

  return resolved.map((r) => {
    const referredUserId = String(r.userId);
    const turnover = turnoverByReferredId.get(referredUserId);
    return {
      userId: referredUserId,
      username: usernameByUserId.get(referredUserId) ?? "—",
      totalDeposit: depositByUserId.get(referredUserId) ?? 0,
      referredAt: r.referredAt.toISOString(),
      turnoverCompleted: turnover?.turnoverCompleted ?? 0,
      turnoverRequired: turnover?.turnoverRequired ?? REFERRED_TURNOVER_THRESHOLD,
      rewardPaid: turnover?.rewardPaid ?? false,
    };
  });
};

export const getMyReferralSummary = async (userId: string): Promise<MyReferralSummary> => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user id");
  }

  const userObjectId = new Types.ObjectId(userId);

  const [user, normalUser, reward, bonusAgg, referredUsers] = await Promise.all([
    User.findById(userObjectId).select("referralId refferCount role").lean(),
    NormalUser.findOne({ user: userObjectId }).select("referralId refferCount").lean(),
    ReferralRewardModel.findOne({ referrer: userObjectId }).lean(),
    ReferralBonusTracking.aggregate<{ turnoverCompleted: number; earnedBonus: number }>([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: null,
          turnoverCompleted: { $sum: "$turnoverCompleted" },
          earnedBonus: {
            $sum: { $cond: ["$rewardPaid", "$bonusAmount", 0] },
          },
        },
      },
    ]),
    getMyReferredUsers(userId),
  ]);

  const referralId = normalUser?.referralId ?? user?.referralId;
  if (!referralId) {
    throw new AppError(httpStatus.NOT_FOUND, "Referral profile not found");
  }

  const bonus = bonusAgg[0];
  // Use Math.max — `??` would keep totalReferred: 0 and hide real referredBy counts
  const inviteCount = Math.max(
    Number(reward?.totalReferred ?? 0),
    Number(normalUser?.refferCount ?? 0),
    Number(user?.refferCount ?? 0),
    referredUsers.length,
  );
  const pendingRewards = reward?.totalPendingTK ?? 0;
  const activeDownline = Math.max(
    Number(normalUser?.refferCount ?? 0),
    Number(user?.refferCount ?? 0),
    inviteCount,
  );

  return {
    referralId,
    activeDownline,
    inviteCount,
    totalRewards: pendingRewards,
    downlineTurnover: bonus?.turnoverCompleted ?? 0,
    rewards: pendingRewards,
    earnedReward: bonus?.earnedBonus ?? 0,
    referredUsers,
  };
};
