import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../errors/AppError';
import { LoginBonusTracking } from '../User/loginBonusTracking.model';
import { UserBalance } from '../Transaction/userBalance.model';
import { SpinHistory } from './spin.model';
import {
  SPIN_ALLOWED_AMOUNTS,
  SPIN_SEGMENT_COUNT,
  SPIN_TURNOVER_MULTIPLIER,
  SPIN_TZ,
  SPIN_WHEEL_SEGMENTS,
} from './spin.constants';

dayjs.extend(utc);
dayjs.extend(timezone);

function todayKey(): string {
  return dayjs().tz(SPIN_TZ).format('YYYY-MM-DD');
}

function spunToday(lastSpinAt: Date | null | undefined): boolean {
  if (!lastSpinAt) return false;
  return dayjs(lastSpinAt).tz(SPIN_TZ).format('YYYY-MM-DD') === todayKey();
}

function nextSpinAtMidnight(): Date {
  return dayjs().tz(SPIN_TZ).add(1, 'day').startOf('day').toDate();
}

function remainingMsUntilNextSpin(): number {
  const next = dayjs().tz(SPIN_TZ).add(1, 'day').startOf('day');
  return Math.max(0, next.valueOf() - Date.now());
}

function pickWeightedAmount(): number {
  const totalWeight = SPIN_WHEEL_SEGMENTS.reduce((sum, s) => sum + s.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const segment of SPIN_WHEEL_SEGMENTS) {
    roll -= segment.weight;
    if (roll <= 0) return segment.amount;
  }

  return SPIN_WHEEL_SEGMENTS[SPIN_WHEEL_SEGMENTS.length - 1].amount;
}

function pickSegmentIndex(amount: number): number {
  const matching = SPIN_WHEEL_SEGMENTS.map((s, i) => (s.amount === amount ? i : -1)).filter(
    (i) => i >= 0
  );
  if (!matching.length) {
    return 0;
  }
  return matching[Math.floor(Math.random() * matching.length)];
}

function buildWheelView() {
  return SPIN_WHEEL_SEGMENTS.map((s, index) => ({
    index,
    amount: s.amount,
  }));
}

export class SpinService {
  static async getStatus(sbmId: string) {
    const now = new Date();

    const u = await UserBalance.findOne({ id: sbmId }).select(
      'id lastSpinAt nextSpinAt lastSpinAmount'
    );

    if (!u) {
      return {
        ok: false as const,
        code: 404 as const,
        message: 'User balance not found',
      };
    }

    const alreadySpunToday = spunToday(u.lastSpinAt);
    const canSpin = !alreadySpunToday;
    const nextSpinAt = alreadySpunToday ? nextSpinAtMidnight() : null;

    return {
      ok: true as const,
      code: 200 as const,
      data: {
        id: sbmId,
        canSpin,
        lastSpinAt: u.lastSpinAt ?? null,
        nextSpinAt,
        lastSpinAmount: u.lastSpinAmount ?? 0,
        remainingMs: canSpin ? 0 : remainingMsUntilNextSpin(),
        segments: buildWheelView(),
        segmentCount: SPIN_SEGMENT_COUNT,
        maxWin: Math.max(...SPIN_ALLOWED_AMOUNTS),
      },
    };
  }

  static async getStatusForUser(userObjectId: string, sbmId: string) {
    const balance = await UserBalance.findOne({ userId: userObjectId }).select('id').lean();
    if (!balance || balance.id !== sbmId) {
      return {
        ok: false as const,
        code: 403 as const,
        message: 'Member id mismatch',
      };
    }
    return SpinService.getStatus(sbmId);
  }

  static async playSpin(opts: {
    userObjectId: string;
    sbmId: string;
    ip?: string;
    ua?: string;
  }) {
    const { userObjectId, sbmId, ip, ua } = opts;
    const now = new Date();

    const balance = await UserBalance.findOne({ userId: userObjectId, id: sbmId });
    if (!balance) {
      return { ok: false as const, code: 404 as const, message: 'User balance not found' };
    }

    if (spunToday(balance.lastSpinAt)) {
      return {
        ok: false as const,
        code: 429 as const,
        message: 'Already spun today',
        data: {
          id: sbmId,
          lastSpinAt: balance.lastSpinAt ?? null,
          nextSpinAt: nextSpinAtMidnight(),
          remainingMs: remainingMsUntilNextSpin(),
        },
      };
    }

    const amount = pickWeightedAmount();
    const segmentIndex = pickSegmentIndex(amount);
    const nextSpinAt = nextSpinAtMidnight();
    const turnoverRequired = amount * SPIN_TURNOVER_MULTIPLIER;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const updated = await UserBalance.findOneAndUpdate(
        {
          userId: userObjectId,
          id: sbmId,
          $or: [
            { lastSpinAt: null },
            { lastSpinAt: { $exists: false } },
            {
              lastSpinAt: {
                $lt: dayjs().tz(SPIN_TZ).startOf('day').toDate(),
              },
            },
          ],
        },
        {
          $inc: {
            currentBalance: amount,
            storeDbBalance: amount,
            totalSpinWon: amount,
            walletRevision: 1,
          },
          $set: {
            lastSpinAt: now,
            nextSpinAt,
            lastSpinAmount: amount,
          },
        },
        { new: true, session }
      );

      if (!updated) {
        throw new AppError(httpStatus.TOO_MANY_REQUESTS, 'Already spun today');
      }

      await LoginBonusTracking.create(
        [
          {
            userId: userObjectId,
            bonusAmount: amount,
            depositAmount: 0,
            turnoverRequired,
            turnoverCompleted: 0,
            isCompleted: false,
          },
        ],
        { session }
      );

      await session.commitTransaction();

      SpinHistory.create({
        sbmId,
        amount,
        claimedAt: now,
        nextSpinAt,
        ip: ip ?? null,
        ua: ua ?? null,
      }).catch(() => undefined);

      return {
        ok: true as const,
        code: 200 as const,
        message: 'Spin completed',
        data: {
          id: sbmId,
          winAmount: amount,
          segmentIndex,
          turnoverRequired,
          currentBalance: updated.currentBalance,
          lastSpinAt: updated.lastSpinAt,
          nextSpinAt: updated.nextSpinAt,
          lastSpinAmount: updated.lastSpinAmount,
          totalSpinWon: updated.totalSpinWon,
        },
      };
    } catch (err) {
      await session.abortTransaction();
      if (err instanceof AppError) {
        return {
          ok: false as const,
          code: err.statusCode as 429,
          message: err.message,
        };
      }
      throw err;
    } finally {
      session.endSession();
    }
  }

  /** @deprecated Client-reported amount — use playSpin instead */
  static async claimSpin(opts: { sbmId: string; amount: number; ip?: string; ua?: string }) {
    const { sbmId, amount, ip, ua } = opts;

    if (!Number.isFinite(amount) || !SPIN_ALLOWED_AMOUNTS.includes(amount)) {
      return { ok: false as const, code: 400 as const, message: 'Invalid spinWinAmount' };
    }

    const balance = await UserBalance.findOne({ id: sbmId }).select('userId lastSpinAt');
    if (!balance?.userId) {
      return { ok: false as const, code: 404 as const, message: 'User balance not found' };
    }

    if (spunToday(balance.lastSpinAt)) {
      return {
        ok: false as const,
        code: 429 as const,
        message: 'Already spun today',
      };
    }

    return SpinService.playSpin({
      userObjectId: String(balance.userId),
      sbmId,
      ip,
      ua,
    });
  }
}
