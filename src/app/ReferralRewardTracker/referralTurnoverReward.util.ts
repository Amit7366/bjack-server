import mongoose, { Types } from 'mongoose';
import { GameTxnRecord } from '../GameTxnRecords/models/GameTxnRecord';
import { ReferralModel } from '../Referral/referral.model';
import { UserBalance } from '../Transaction/userBalance.model';
import { LoginBonusTracking } from '../User/loginBonusTracking.model';
import { ReferralBonusTracking } from './referralBonusTracking.model';
import { ReferralRewardModel } from './referralReward.model';
import {
  REFERRED_TURNOVER_THRESHOLD,
  REFERRER_BONUS_AMOUNT,
  REFERRER_TURNOVER_MULTIPLIER,
} from './referralTurnoverReward.constants';

async function sumLifetimeTurnover(userId: Types.ObjectId): Promise<number> {
  const agg = await GameTxnRecord.aggregate<{ total: number }>([
    { $match: { userId } },
    { $group: { _id: null, total: { $sum: '$bet' } } },
  ]);
  return Number(agg[0]?.total ?? 0);
}

/**
 * Ensure a turnover tracker exists for a referred user (idempotent).
 * Backfills lifetime turnover for users who already played before tracking existed.
 */
export async function ensureReferralTurnoverTracking(referredUserId: string): Promise<void> {
  if (!Types.ObjectId.isValid(referredUserId)) return;

  const referredObjectId = new Types.ObjectId(referredUserId);
  const pair = await ReferralModel.findOne({ referredUser: referredObjectId }).lean();
  if (!pair?.referrer) return;

  const res = await ReferralBonusTracking.updateOne(
    { userId: pair.referrer, referredUserId: referredObjectId },
    {
      $setOnInsert: {
        userId: pair.referrer,
        referredUserId: referredObjectId,
        bonusAmount: REFERRER_BONUS_AMOUNT,
        turnoverRequired: REFERRED_TURNOVER_THRESHOLD,
        turnoverCompleted: 0,
        isCompleted: false,
        rewardPaid: false,
      },
    },
    { upsert: true }
  );

  const didInsert = (res as { upsertedCount?: number; upsertedId?: unknown }).upsertedCount === 1
    || Boolean((res as { upsertedId?: unknown }).upsertedId);

  const existing = await ReferralBonusTracking.findOne({
    userId: pair.referrer,
    referredUserId: referredObjectId,
  }).lean();

  if (!existing || existing.rewardPaid) return;

  const needsBackfill =
    didInsert ||
    (!existing.isCompleted && Number(existing.turnoverCompleted ?? 0) === 0);

  if (!needsBackfill) return;

  const lifetimeTurnover = await sumLifetimeTurnover(referredObjectId);
  if (lifetimeTurnover <= 0) return;

  const willComplete = lifetimeTurnover >= REFERRED_TURNOVER_THRESHOLD;
  await ReferralBonusTracking.updateOne(
    { _id: existing._id, rewardPaid: { $ne: true } },
    {
      $set: {
        turnoverCompleted: lifetimeTurnover,
        ...(willComplete ? { isCompleted: true } : {}),
      },
    }
  );
}

/**
 * Credit referrer once when a referred user reaches the turnover threshold.
 * Idempotent via rewardPaid flag.
 */
export async function creditReferrerTurnoverReward(
  trackingId: Types.ObjectId
): Promise<boolean> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const tracker = await ReferralBonusTracking.findOneAndUpdate(
      {
        _id: trackingId,
        isCompleted: true,
        rewardPaid: { $ne: true },
      },
      { $set: { rewardPaid: true, rewardPaidAt: new Date() } },
      { session, new: false }
    );

    if (!tracker) {
      await session.abortTransaction();
      return false;
    }

    const referrerId = String(tracker.userId);
    const bonusAmount = Number(tracker.bonusAmount ?? REFERRER_BONUS_AMOUNT);
    const turnoverRequired = bonusAmount * REFERRER_TURNOVER_MULTIPLIER;

    await LoginBonusTracking.create(
      [
        {
          userId: tracker.userId,
          bonusAmount,
          depositAmount: 0,
          turnoverRequired,
          turnoverCompleted: 0,
          isCompleted: false,
        },
      ],
      { session }
    );

    // Member referrers have UserBalance; advertisers use PartnerBalance and
    // earn commission separately — skip TK wallet credit without failing the request.
    const updatedBalance = await UserBalance.findOneAndUpdate(
      { userId: tracker.userId },
      {
        $inc: {
          currentBalance: bonusAmount,
          walletRevision: 1,
        },
      },
      { session, new: true }
    );

    if (!updatedBalance) {
      await session.abortTransaction();
      return false;
    }

    await ReferralRewardModel.updateOne(
      { referrer: tracker.userId },
      { $inc: { totalReleasedTK: bonusAmount } },
      { session, upsert: true }
    );

    await session.commitTransaction();
    return true;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

/** Pay any completed, unpaid referral turnover rewards for the given referred users. */
export async function payReferralTurnoverRewards(referredUserIds: string[]): Promise<void> {
  if (!referredUserIds.length) return;

  const objectIds = referredUserIds
    .filter((id) => Types.ObjectId.isValid(id))
    .map((id) => new Types.ObjectId(id));

  if (!objectIds.length) return;

  const unpaid = await ReferralBonusTracking.find({
    referredUserId: { $in: objectIds },
    isCompleted: true,
    rewardPaid: { $ne: true },
  })
    .select('_id')
    .lean();

  for (const row of unpaid) {
    await creditReferrerTurnoverReward(row._id as Types.ObjectId);
  }
}
