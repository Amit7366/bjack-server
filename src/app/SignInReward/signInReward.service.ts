import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../errors/AppError';
import { LoginBonusTracking } from '../User/loginBonusTracking.model';
import { UserBalance } from '../Transaction/userBalance.model';
import { SignInRewardState } from './signInReward.model';
import {
  SIGN_IN_CYCLE_DAYS,
  SIGN_IN_DAY_BONUSES,
  SIGN_IN_MIN_TOTAL_DEPOSIT,
  SIGN_IN_TURNOVER_MULTIPLIER,
  SIGN_IN_TZ,
} from './signInReward.constants';

dayjs.extend(utc);
dayjs.extend(timezone);

export type SignInDayStatus = 'claimed' | 'current' | 'locked';

export type SignInDayView = {
  day: number;
  bonus: number;
  status: SignInDayStatus;
};

export type SignInRewardStatus = {
  lastSignIn: string | null;
  lastClaimedDay: number;
  totalBonusClaimed: number;
  minimumDepositRequired: number;
  totalDeposit: number;
  minimumDepositMet: boolean;
  canClaimToday: boolean;
  claimedToday: boolean;
  currentDay: number;
  days: SignInDayView[];
};

function dayKey(date: Date): string {
  return dayjs(date).tz(SIGN_IN_TZ).format('YYYY-MM-DD');
}

function todayKey(): string {
  return dayjs().tz(SIGN_IN_TZ).format('YYYY-MM-DD');
}

function yesterdayKey(): string {
  return dayjs().tz(SIGN_IN_TZ).subtract(1, 'day').format('YYYY-MM-DD');
}

function isClaimedToday(lastClaimedAt: Date | null | undefined): boolean {
  if (!lastClaimedAt) return false;
  return dayKey(lastClaimedAt) === todayKey();
}

function streakBroken(lastClaimedAt: Date | null | undefined): boolean {
  if (!lastClaimedAt) return false;
  const last = dayKey(lastClaimedAt);
  return last !== todayKey() && last !== yesterdayKey();
}

async function ensureState(userId: string) {
  let state = await SignInRewardState.findOne({ userId });
  if (!state) {
    state = await SignInRewardState.create({
      userId,
      nextDay: 1,
      lastClaimedAt: null,
      totalBonusClaimed: 0,
    });
  }
  return state;
}

async function syncStreakIfBroken(userId: string, state: InstanceType<typeof SignInRewardState>) {
  if (streakBroken(state.lastClaimedAt) && state.nextDay !== 1) {
    state.nextDay = 1;
    await state.save();
  }
  return state;
}

function buildDayViews(nextDay: number, claimedToday: boolean): SignInDayView[] {
  return Array.from({ length: SIGN_IN_CYCLE_DAYS }, (_, i) => {
    const day = i + 1;
    const bonus = SIGN_IN_DAY_BONUSES[day] ?? 0;
    let status: SignInDayStatus;

    if (day < nextDay) {
      status = 'claimed';
    } else if (day === nextDay) {
      status = claimedToday ? 'locked' : 'current';
    } else {
      status = 'locked';
    }

    return { day, bonus, status };
  });
}

export async function getSignInRewardStatus(userId: string): Promise<SignInRewardStatus> {
  let state = await ensureState(userId);
  state = await syncStreakIfBroken(userId, state);

  const balance = await UserBalance.findOne({ userId }).lean();
  const totalDeposit = Number(balance?.totalDeposit ?? 0);
  const minimumDepositMet = totalDeposit >= SIGN_IN_MIN_TOTAL_DEPOSIT;
  const claimedToday = isClaimedToday(state.lastClaimedAt);

  let effectiveNextDay = state.nextDay;
  if (!state.lastClaimedAt || streakBroken(state.lastClaimedAt)) {
    effectiveNextDay = 1;
  }

  return {
    lastSignIn: state.lastClaimedAt ? state.lastClaimedAt.toISOString() : null,
    lastClaimedDay: Number(state.lastClaimedDay ?? 0),
    totalBonusClaimed: Number(state.totalBonusClaimed ?? 0),
    minimumDepositRequired: SIGN_IN_MIN_TOTAL_DEPOSIT,
    totalDeposit,
    minimumDepositMet,
    canClaimToday: minimumDepositMet && !claimedToday,
    claimedToday,
    currentDay: effectiveNextDay,
    days: buildDayViews(effectiveNextDay, claimedToday),
  };
}

export async function claimSignInReward(userId: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let state = await SignInRewardState.findOne({ userId }).session(session);
    if (!state) {
      [state] = await SignInRewardState.create(
        [{ userId, nextDay: 1, lastClaimedAt: null, totalBonusClaimed: 0 }],
        { session }
      );
    }

    if (streakBroken(state.lastClaimedAt)) {
      state.nextDay = 1;
    }

    if (isClaimedToday(state.lastClaimedAt)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'You have already signed in today');
    }

    const balance = await UserBalance.findOne({ userId }).session(session);
    const totalDeposit = Number(balance?.totalDeposit ?? 0);
    if (totalDeposit < SIGN_IN_MIN_TOTAL_DEPOSIT) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Minimum total deposit of ${SIGN_IN_MIN_TOTAL_DEPOSIT} TK is required to claim sign-in rewards`
      );
    }

    const dayToClaim = state.nextDay;
    const bonusAmount = SIGN_IN_DAY_BONUSES[dayToClaim];
    if (!bonusAmount) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid sign-in day');
    }

    const turnoverRequired = bonusAmount * SIGN_IN_TURNOVER_MULTIPLIER;
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

    const nextDayAfterClaim = dayToClaim >= SIGN_IN_CYCLE_DAYS ? 1 : dayToClaim + 1;

    state.lastClaimedAt = now;
    state.lastClaimedDay = dayToClaim;
    state.totalBonusClaimed = Number(state.totalBonusClaimed ?? 0) + bonusAmount;
    state.nextDay = nextDayAfterClaim;
    await state.save({ session });

    await session.commitTransaction();

    return {
      dayClaimed: dayToClaim,
      bonusAmount,
      turnoverRequired,
      balance: Number(updatedBalance.currentBalance).toFixed(2),
      totalBonusClaimed: state.totalBonusClaimed,
      lastSignIn: state.lastClaimedAt.toISOString(),
      nextDay: state.nextDay,
    };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}
