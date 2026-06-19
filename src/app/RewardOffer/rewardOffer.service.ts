import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../errors/AppError';
import { LoginBonusTracking } from '../User/loginBonusTracking.model';
import { ReferralRewardModel } from '../ReferralRewardTracker/referralReward.model';
import { Transaction } from '../Transaction/transaction.model';
import { UserBalance } from '../Transaction/userBalance.model';
import { REWARD_OFFER_TZ } from './rewardOffer.constants';
import {
  IRewardOffer,
  RewardOfferCriteriaProgress,
  RewardOfferMemberView,
} from './rewardOffer.interface';
import { RewardOffer } from './rewardOffer.model';
import { RewardOfferClaim } from './rewardOfferClaim.model';

dayjs.extend(utc);
dayjs.extend(timezone);

type OfferDoc = InstanceType<typeof RewardOffer>;
type ClaimDoc = InstanceType<typeof RewardOfferClaim>;

function todayRange(): { start: Date; end: Date } {
  const start = dayjs().tz(REWARD_OFFER_TZ).startOf('day').toDate();
  const end = dayjs().tz(REWARD_OFFER_TZ).endOf('day').toDate();
  return { start, end };
}

function nextClaimDate(lastClaimedAt: Date, cooldownHours: number): Date {
  return dayjs(lastClaimedAt).tz(REWARD_OFFER_TZ).add(cooldownHours, 'hour').toDate();
}

async function getDailyDepositTotal(userId: string): Promise<number> {
  const { start, end } = todayRange();
  const rows = await Transaction.aggregate<{ total: number }>([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        transactionType: 'deposit',
        status: 'success',
        createdAt: { $gte: start, $lte: end },
      },
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  return Number(rows[0]?.total ?? 0);
}

async function getTotalDeposit(userId: string): Promise<number> {
  const balance = await UserBalance.findOne({ userId }).lean();
  return Number(balance?.totalDeposit ?? 0);
}

async function getReferralCount(userId: string): Promise<number> {
  const reward = await ReferralRewardModel.findOne({ referrer: userId }).lean();
  return Number(reward?.totalReferred ?? 0);
}

async function evaluateCriteria(
  userId: string,
  offer: OfferDoc,
): Promise<{ criteriaMet: boolean; criteriaProgress: RewardOfferCriteriaProgress | null }> {
  const required = Number(offer.criteriaValue ?? 0);

  switch (offer.criteriaType) {
    case 'none':
      return { criteriaMet: true, criteriaProgress: null };
    case 'daily_deposit': {
      const current = await getDailyDepositTotal(userId);
      return {
        criteriaMet: current >= required,
        criteriaProgress: { current, required },
      };
    }
    case 'total_deposit': {
      const current = await getTotalDeposit(userId);
      return {
        criteriaMet: current >= required,
        criteriaProgress: { current, required },
      };
    }
    case 'referral': {
      const current = await getReferralCount(userId);
      return {
        criteriaMet: current >= required,
        criteriaProgress: { current, required },
      };
    }
    default:
      return { criteriaMet: false, criteriaProgress: null };
  }
}

function buildMemberView(
  offer: OfferDoc,
  claim: ClaimDoc | null,
  criteriaMet: boolean,
  criteriaProgress: RewardOfferCriteriaProgress | null,
): RewardOfferMemberView {
  const now = Date.now();
  const lastClaimedAt = claim?.lastClaimedAt ?? null;
  let canClaim = criteriaMet;
  let nextClaimAt: Date | null = null;
  let remainingMs = 0;

  if (lastClaimedAt) {
    nextClaimAt = nextClaimDate(lastClaimedAt, offer.cooldownHours);
    remainingMs = Math.max(0, nextClaimAt.getTime() - now);
    if (remainingMs > 0) {
      canClaim = false;
    }
  }

  return {
    id: String(offer._id),
    slug: offer.slug,
    title: offer.title,
    description: offer.description,
    bonusAmount: offer.bonusAmount,
    turnoverMultiplier: offer.turnoverMultiplier,
    cooldownHours: offer.cooldownHours,
    criteriaType: offer.criteriaType,
    criteriaValue: offer.criteriaValue,
    sortOrder: offer.sortOrder,
    canClaim,
    criteriaMet,
    criteriaProgress,
    lastClaimedAt: lastClaimedAt ? lastClaimedAt.toISOString() : null,
    nextClaimAt: nextClaimAt ? nextClaimAt.toISOString() : null,
    remainingMs,
    claimCount: Number(claim?.claimCount ?? 0),
    totalClaimed: Number(claim?.totalClaimed ?? 0),
  };
}

async function getClaimMap(userId: string, offerIds: mongoose.Types.ObjectId[]) {
  const claims = await RewardOfferClaim.find({
    userId,
    offerId: { $in: offerIds },
  });
  const map = new Map<string, ClaimDoc>();
  for (const claim of claims) {
    map.set(String(claim.offerId), claim);
  }
  return map;
}

export async function getMemberRewardOffers(userId: string): Promise<RewardOfferMemberView[]> {
  const offers = await RewardOffer.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 });
  const claimMap = await getClaimMap(
    userId,
    offers.map((offer) => offer._id as mongoose.Types.ObjectId),
  );

  const views: RewardOfferMemberView[] = [];
  for (const offer of offers) {
    const claim = claimMap.get(String(offer._id)) ?? null;
    const { criteriaMet, criteriaProgress } = await evaluateCriteria(userId, offer);
    views.push(buildMemberView(offer, claim, criteriaMet, criteriaProgress));
  }
  return views;
}

export async function claimRewardOffer(userId: string, offerId: string) {
  if (!mongoose.Types.ObjectId.isValid(offerId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid offer id');
  }

  const offer = await RewardOffer.findById(offerId);
  if (!offer || !offer.isActive) {
    throw new AppError(httpStatus.NOT_FOUND, 'Reward offer not found');
  }

  const { criteriaMet } = await evaluateCriteria(userId, offer);
  if (!criteriaMet) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Offer criteria not met');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let claim = await RewardOfferClaim.findOne({ userId, offerId }).session(session);
    if (!claim) {
      [claim] = await RewardOfferClaim.create(
        [{ userId, offerId, lastClaimedAt: null, claimCount: 0, totalClaimed: 0 }],
        { session },
      );
    }

    const view = buildMemberView(offer, claim, criteriaMet, null);
    if (!view.canClaim) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `You can claim again after the cooldown period (${offer.cooldownHours} hours)`,
      );
    }

    const bonusAmount = offer.bonusAmount;
    const turnoverRequired = bonusAmount * Number(offer.turnoverMultiplier ?? 1);
    const now = new Date();

    await LoginBonusTracking.create(
      [
        {
          userId,
          bonusAmount,
          depositAmount: 0,
          turnoverRequired,
          turnoverCompleted: 0,
          isCompleted: false,
        },
      ],
      { session },
    );

    const updatedBalance = await UserBalance.findOneAndUpdate(
      { userId },
      {
        $inc: {
          currentBalance: bonusAmount,
          walletRevision: 1,
        },
      },
      { new: true, session, upsert: false },
    );

    if (!updatedBalance) {
      throw new AppError(httpStatus.NOT_FOUND, 'User balance not found');
    }

    claim.lastClaimedAt = now;
    claim.claimCount = Number(claim.claimCount ?? 0) + 1;
    claim.totalClaimed = Number(claim.totalClaimed ?? 0) + bonusAmount;
    await claim.save({ session });

    await session.commitTransaction();

    const { criteriaProgress } = await evaluateCriteria(userId, offer);
    const updatedView = buildMemberView(offer, claim, criteriaMet, criteriaProgress);

    return {
      offer: updatedView,
      bonusAmount,
      turnoverRequired,
      balance: Number(updatedBalance.currentBalance).toFixed(2),
    };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

export async function getAllRewardOffersForAdmin() {
  return RewardOffer.find().sort({ sortOrder: 1, createdAt: 1 });
}

export async function createRewardOffer(payload: IRewardOffer) {
  const existing = await RewardOffer.findOne({ slug: payload.slug });
  if (existing) {
    throw new AppError(httpStatus.CONFLICT, 'Offer slug already exists');
  }
  return RewardOffer.create(payload);
}

export async function updateRewardOffer(id: string, payload: Partial<IRewardOffer>) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid offer id');
  }
  if (payload.slug) {
    const duplicate = await RewardOffer.findOne({ slug: payload.slug, _id: { $ne: id } });
    if (duplicate) {
      throw new AppError(httpStatus.CONFLICT, 'Offer slug already exists');
    }
  }
  const updated = await RewardOffer.findByIdAndUpdate(id, payload, { new: true });
  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, 'Reward offer not found');
  }
  return updated;
}

export async function deleteRewardOffer(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid offer id');
  }
  const deleted = await RewardOffer.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Reward offer not found');
  }
  await RewardOfferClaim.deleteMany({ offerId: id });
  return deleted;
}
