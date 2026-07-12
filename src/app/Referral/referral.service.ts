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
import { Transaction } from "../Transaction/transaction.model";
import { PartnerCommissionLedger } from "../PartnerCommission/partnerCommissionLedger.model";
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

export type PartnerReferredUserDetail = {
  userId: string;
  memberId: string;
  username: string;
  status: string;
  referredAt: string;
  lastActiveAt: string | null;
  kycVerified: boolean;
  kycStatus: string | null;
  totalDeposit: number;
  totalWithdraw: number;
  netDeposit: number;
  depositCount: number;
  ftdAt: string | null;
  commissionEarned: number;
};

export type PartnerReferredUsersPage = {
  meta: { page: number; limit: number; total: number; totalPages: number };
  summary: {
    totalReferred: number;
    withFtd: number;
    totalDeposits: number;
    totalWithdraws: number;
    netDeposits: number;
    totalCommission: number;
  };
  rows: PartnerReferredUserDetail[];
};

export type PartnerReferredUsersQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  ftd?: string;
  from?: string;
  to?: string;
};

/**
 * Paginated referred-user roster for advertiser partners with deposit/FTD/commission joins.
 */
export const getPartnerReferredUsersPage = async (
  partnerUserId: string,
  query: PartnerReferredUsersQuery = {},
): Promise<PartnerReferredUsersPage> => {
  if (!Types.ObjectId.isValid(partnerUserId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user id");
  }

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const search = query.search?.trim() || "";
  const statusFilter = query.status?.trim().toLowerCase() || "all";
  const ftdFilter = query.ftd?.trim().toLowerCase() || "all";

  const resolved = await resolveReferredUserIds(partnerUserId);
  if (!resolved.length) {
    return {
      meta: { page, limit, total: 0, totalPages: 0 },
      summary: {
        totalReferred: 0,
        withFtd: 0,
        totalDeposits: 0,
        totalWithdraws: 0,
        netDeposits: 0,
        totalCommission: 0,
      },
      rows: [],
    };
  }

  let filtered = resolved;

  if (query.from) {
    const fromDate = new Date(query.from);
    if (!Number.isNaN(fromDate.getTime())) {
      fromDate.setUTCHours(0, 0, 0, 0);
      filtered = filtered.filter((r) => r.referredAt >= fromDate);
    }
  }
  if (query.to) {
    const toDate = new Date(query.to);
    if (!Number.isNaN(toDate.getTime())) {
      toDate.setUTCHours(23, 59, 59, 999);
      filtered = filtered.filter((r) => r.referredAt <= toDate);
    }
  }

  const referredAtById = new Map(
    filtered.map((r) => [String(r.userId), r.referredAt]),
  );
  const candidateIds = filtered.map((r) => r.userId);

  if (!candidateIds.length) {
    return {
      meta: { page, limit, total: 0, totalPages: 0 },
      summary: {
        totalReferred: 0,
        withFtd: 0,
        totalDeposits: 0,
        totalWithdraws: 0,
        netDeposits: 0,
        totalCommission: 0,
      },
      rows: [],
    };
  }

  const userMatch: Record<string, unknown> = { _id: { $in: candidateIds } };
  if (
    statusFilter !== "all" &&
    ["active", "frozen", "deactivated", "pending"].includes(statusFilter)
  ) {
    userMatch.status = statusFilter;
  }
  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    userMatch.$or = [
      { id: { $regex: escaped, $options: "i" } },
      { userName: { $regex: escaped, $options: "i" } },
    ];
  }

  const users = await User.find(userMatch)
    .select("id userName status lastActiveAt kycVerified kycStatus")
    .lean();

  let matchedIds = users.map((u) => u._id as Types.ObjectId);

  const balances = matchedIds.length
    ? await UserBalance.find({ userId: { $in: matchedIds } })
        .select("userId totalDeposit totalWithdraw")
        .lean()
    : [];

  const balanceByUserId = new Map(
    balances.map((b) => [
      String(b.userId),
      {
        totalDeposit: Number(b.totalDeposit ?? 0),
        totalWithdraw: Number(b.totalWithdraw ?? 0),
      },
    ]),
  );

  if (ftdFilter === "yes") {
    matchedIds = matchedIds.filter(
      (id) => (balanceByUserId.get(String(id))?.totalDeposit ?? 0) > 0,
    );
  } else if (ftdFilter === "no") {
    matchedIds = matchedIds.filter(
      (id) => (balanceByUserId.get(String(id))?.totalDeposit ?? 0) <= 0,
    );
  }

  const matchedIdSet = new Set(matchedIds.map((id) => String(id)));
  const usersById = new Map(
    users
      .filter((u) => matchedIdSet.has(String(u._id)))
      .map((u) => [String(u._id), u]),
  );

  // Preserve referredAt sort order from resolve
  const orderedIds = filtered
    .map((r) => String(r.userId))
    .filter((id) => matchedIdSet.has(id));

  const total = orderedIds.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  const skip = (page - 1) * limit;
  const pageIds = orderedIds.slice(skip, skip + limit);
  const pageObjectIds = pageIds.map((id) => new Types.ObjectId(id));

  let totalDeposits = 0;
  let totalWithdraws = 0;
  let withFtd = 0;
  for (const id of orderedIds) {
    const bal = balanceByUserId.get(id) ?? { totalDeposit: 0, totalWithdraw: 0 };
    totalDeposits += bal.totalDeposit;
    totalWithdraws += bal.totalWithdraw;
    if (bal.totalDeposit > 0) withFtd += 1;
  }

  const partnerObjectId = new Types.ObjectId(partnerUserId);
  const allMatchedObjectIds = orderedIds.map((id) => new Types.ObjectId(id));

  const [commissionAllAgg, depositAgg, commissionPageAgg, normalUsers] =
    await Promise.all([
      allMatchedObjectIds.length
        ? PartnerCommissionLedger.aggregate<{
            _id: null;
            total: number;
          }>([
            {
              $match: {
                partnerUserId: partnerObjectId,
                referredUserId: { $in: allMatchedObjectIds },
              },
            },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ])
        : Promise.resolve([]),
      pageObjectIds.length
        ? Transaction.aggregate<{
            _id: Types.ObjectId;
            depositCount: number;
            ftdAt: Date;
          }>([
            {
              $match: {
                userId: { $in: pageObjectIds },
                transactionType: "deposit",
                status: "success",
              },
            },
            {
              $group: {
                _id: "$userId",
                depositCount: { $sum: 1 },
                ftdAt: { $min: "$createdAt" },
              },
            },
          ])
        : Promise.resolve([]),
      pageObjectIds.length
        ? PartnerCommissionLedger.aggregate<{
            _id: Types.ObjectId;
            total: number;
          }>([
            {
              $match: {
                partnerUserId: partnerObjectId,
                referredUserId: { $in: pageObjectIds },
              },
            },
            {
              $group: {
                _id: "$referredUserId",
                total: { $sum: "$amount" },
              },
            },
          ])
        : Promise.resolve([]),
      pageObjectIds.length
        ? NormalUser.find({ user: { $in: pageObjectIds } })
            .select("user userName id kycVerified kycStatus")
            .lean()
        : Promise.resolve([]),
    ]);

  const depositByUserId = new Map(
    depositAgg.map((d) => [
      String(d._id),
      {
        depositCount: Number(d.depositCount ?? 0),
        ftdAt: d.ftdAt ? new Date(d.ftdAt) : null,
      },
    ]),
  );

  const commissionByUserId = new Map(
    commissionPageAgg.map((c) => [String(c._id), Number(c.total ?? 0)]),
  );

  const normalByUserId = new Map(
    normalUsers.map((nu) => [String(nu.user), nu]),
  );

  const rows: PartnerReferredUserDetail[] = pageIds.map((id) => {
    const user = usersById.get(id);
    const nu = normalByUserId.get(id);
    const bal = balanceByUserId.get(id) ?? {
      totalDeposit: 0,
      totalWithdraw: 0,
    };
    const dep = depositByUserId.get(id);
    const totalDeposit = bal.totalDeposit;
    const totalWithdraw = bal.totalWithdraw;
    const referredAt = referredAtById.get(id) ?? new Date();

    return {
      userId: id,
      memberId: user?.id ?? nu?.id ?? "—",
      username: user?.userName ?? nu?.userName ?? user?.id ?? "—",
      status: String(user?.status ?? "active"),
      referredAt: referredAt.toISOString(),
      lastActiveAt: user?.lastActiveAt
        ? new Date(user.lastActiveAt).toISOString()
        : null,
      kycVerified: Boolean(user?.kycVerified ?? nu?.kycVerified ?? false),
      kycStatus:
        (user?.kycStatus as string | null | undefined) ??
        (nu?.kycStatus as string | null | undefined) ??
        null,
      totalDeposit,
      totalWithdraw,
      netDeposit: totalDeposit - totalWithdraw,
      depositCount: dep?.depositCount ?? (totalDeposit > 0 ? 1 : 0),
      ftdAt: dep?.ftdAt ? dep.ftdAt.toISOString() : null,
      commissionEarned: commissionByUserId.get(id) ?? 0,
    };
  });

  const totalCommission = Number(commissionAllAgg[0]?.total ?? 0);

  return {
    meta: { page, limit, total, totalPages },
    summary: {
      totalReferred: total,
      withFtd,
      totalDeposits,
      totalWithdraws,
      netDeposits: totalDeposits - totalWithdraws,
      totalCommission,
    },
    rows,
  };
};
