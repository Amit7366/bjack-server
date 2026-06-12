import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../errors/AppError';
import { LoginBonusTracking } from '../User/loginBonusTracking.model';
import { UserBalance } from '../Transaction/userBalance.model';
import { MemberBonusRewardState } from './memberBonusReward.model';
import {
  MEMBER_BONUS_AMOUNT,
  MEMBER_BONUS_COOLDOWN_DAYS,
  MEMBER_BONUS_TURNOVER_MULTIPLIER,
  MEMBER_BONUS_TZ,
} from './memberBonusReward.constants';

dayjs.extend(utc);
dayjs.extend(timezone);

export type MemberBonusRewardStatus = {
  bonusAmount: number;
  cooldownDays: number;
  canClaim: boolean;
  lastClaimedAt: string | null;
  nextClaimAt: string | null;
  remainingMs: number;
  totalBonusClaimed: number;
  claimCount: number;
};

function nextClaimDate(lastClaimedAt: Date): Date {
  return dayjs(lastClaimedAt)
    .tz(MEMBER_BONUS_TZ)
    .add(MEMBER_BONUS_COOLDOWN_DAYS, 'day')
    .toDate();
}

function buildStatus(state: InstanceType<typeof MemberBonusRewardState>): MemberBonusRewardStatus {
  const now = Date.now();
  const lastClaimedAt = state.lastClaimedAt ?? null;

  let canClaim = true;
  let nextClaimAt: Date | null = null;
  let remainingMs = 0;

  if (lastClaimedAt) {
    nextClaimAt = nextClaimDate(lastClaimedAt);
    remainingMs = Math.max(0, nextClaimAt.getTime() - now);
    canClaim = remainingMs <= 0;
  }

  return {
    bonusAmount: MEMBER_BONUS_AMOUNT,
    cooldownDays: MEMBER_BONUS_COOLDOWN_DAYS,
    canClaim,
    lastClaimedAt: lastClaimedAt ? lastClaimedAt.toISOString() : null,
    nextClaimAt: nextClaimAt ? nextClaimAt.toISOString() : null,
    remainingMs,
    totalBonusClaimed: Number(state.totalBonusClaimed ?? 0),
    claimCount: Number(state.claimCount ?? 0),
  };
}

async function ensureState(userId: string) {
  let state = await MemberBonusRewardState.findOne({ userId });
  if (!state) {
    state = await MemberBonusRewardState.create({
      userId,
      lastClaimedAt: null,
      totalBonusClaimed: 0,
      claimCount: 0,
    });
  }
  return state;
}

export async function getMemberBonusRewardStatus(userId: string): Promise<MemberBonusRewardStatus> {
  const state = await ensureState(userId);
  return buildStatus(state);
}

export async function claimMemberBonusReward(userId: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let state = await MemberBonusRewardState.findOne({ userId }).session(session);
    if (!state) {
      [state] = await MemberBonusRewardState.create(
        [{ userId, lastClaimedAt: null, totalBonusClaimed: 0, claimCount: 0 }],
        { session }
      );
    }

    const status = buildStatus(state);
    if (!status.canClaim) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `You can claim again after ${MEMBER_BONUS_COOLDOWN_DAYS} days from your last claim`
      );
    }

    const bonusAmount = MEMBER_BONUS_AMOUNT;
    const turnoverRequired = bonusAmount * MEMBER_BONUS_TURNOVER_MULTIPLIER;
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
      { session }
    );

    const updatedBalance = await UserBalance.findOneAndUpdate(
      { userId },
      {
        $inc: {
          currentBalance: bonusAmount,
          walletRevision: 1,
        },
      },
      { new: true, session, upsert: false }
    );

    if (!updatedBalance) {
      throw new AppError(httpStatus.NOT_FOUND, 'User balance not found');
    }

    state.lastClaimedAt = now;
    state.totalBonusClaimed = Number(state.totalBonusClaimed ?? 0) + bonusAmount;
    state.claimCount = Number(state.claimCount ?? 0) + 1;
    await state.save({ session });

    await session.commitTransaction();

    const nextStatus = buildStatus(state);

    return {
      bonusAmount,
      turnoverRequired,
      balance: Number(updatedBalance.currentBalance).toFixed(2),
      lastClaimedAt: state.lastClaimedAt.toISOString(),
      nextClaimAt: nextStatus.nextClaimAt,
      totalBonusClaimed: state.totalBonusClaimed,
      claimCount: state.claimCount,
    };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}
