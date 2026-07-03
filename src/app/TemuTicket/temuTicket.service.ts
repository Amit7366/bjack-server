import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import AppError from '../errors/AppError';
import { LoginBonusTracking } from '../User/loginBonusTracking.model';
import { UserBalance } from '../Transaction/userBalance.model';
import { TemuTicketRecord } from './temuTicket.model';
import { TemuTicketSession } from './temuTicketSession.model';
import {
  TEMU_REFERRAL_BOOST_MAX,
  TEMU_REFERRAL_BOOST_MIN,
  TEMU_TICKET_SESSION_DAYS,
  TEMU_TICKET_TARGET_MAX,
  TEMU_TICKET_TARGET_MIN,
  TEMU_TICKET_TURNOVER_MULTIPLIER,
} from './temuTicket.constants';

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

type SupportedLocale = 'en' | 'bn' | 'hi';

function resolveLocale(value?: string): SupportedLocale {
  if (value === 'bn' || value === 'hi') return value;
  return 'en';
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomTargetAmount(): number {
  return roundMoney(randomBetween(TEMU_TICKET_TARGET_MIN, TEMU_TICKET_TARGET_MAX));
}

function randomReferralBoost(): number {
  return roundMoney(randomBetween(TEMU_REFERRAL_BOOST_MIN, TEMU_REFERRAL_BOOST_MAX));
}

function ticketNameForLocale(locale: SupportedLocale, targetAmount: number): string {
  const target = Math.round(targetAmount);
  if (locale === 'bn') {
    return `৳${target} পুরস্কার পান, বন্ধুকে আমন্ত্রণ করে ট্রেজার বক্স খুলুন!`;
  }
  if (locale === 'hi') {
    return `৳${target} इनाम पाएं, दोस्तों को आमंत्रित करके ट्रेजर बॉक्स खोलें!`;
  }
  return `Get ৳${target} reward — invite friends to open the treasure box!`;
}

function conditionForLocale(locale: SupportedLocale): string {
  if (locale === 'bn') return 'প্রাথমিক পয়েন্ট দাবি করুন';
  if (locale === 'hi') return 'प्राथमिक अंक दावा करें';
  return 'Claim reward';
}

function formatHistoryDate(value: Date): string {
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, '0');
  const d = String(value.getDate()).padStart(2, '0');
  const hh = String(value.getHours()).padStart(2, '0');
  const mm = String(value.getMinutes()).padStart(2, '0');
  const ss = String(value.getSeconds()).padStart(2, '0');
  return `${y}/${m}/${d} ${hh}:${mm}:${ss}`;
}

function sessionExpiresAt(from = new Date()): Date {
  const expires = new Date(from);
  expires.setDate(expires.getDate() + TEMU_TICKET_SESSION_DAYS);
  return expires;
}

async function expireStaleSessions(userId: string): Promise<void> {
  const now = new Date();
  await TemuTicketSession.updateMany(
    {
      userId: new Types.ObjectId(userId),
      status: 'active',
      expiresAt: { $lt: now },
    },
    { $set: { status: 'expired' } }
  );
}

async function getOrCreateActiveSession(userId: string) {
  await expireStaleSessions(userId);
  const userObjectId = new Types.ObjectId(userId);

  let session = await TemuTicketSession.findOne({
    userId: userObjectId,
    status: 'active',
  }).sort({ createdAt: -1 });

  if (!session) {
    [session] = await TemuTicketSession.create([
      {
        userId: userObjectId,
        targetAmount: randomTargetAmount(),
        progressAmount: 0,
        claimedToWallet: 0,
        primaryClaimed: false,
        finalClaimed: false,
        inviteCount: 0,
        status: 'active',
        expiresAt: sessionExpiresAt(),
      },
    ]);
  }

  return session;
}

function buildSessionView(
  session: InstanceType<typeof TemuTicketSession>,
  locale: SupportedLocale
) {
  const targetAmount = roundMoney(Number(session.targetAmount));
  const progressAmount = roundMoney(Number(session.progressAmount));
  const percent = targetAmount > 0 ? Math.min(100, Math.floor((progressAmount / targetAmount) * 100)) : 0;
  const remainingToTarget = roundMoney(Math.max(0, targetAmount - progressAmount));
  const isComplete = progressAmount >= targetAmount;
  const canClaimReward =
    isComplete && !session.finalClaimed && session.status === 'active';

  return {
    sessionId: String(session._id),
    targetAmount,
    progressAmount,
    percent,
    remainingToTarget,
    inviteCount: Number(session.inviteCount ?? 0),
    rewardClaimed: Boolean(session.finalClaimed),
    status: session.status,
    expiresAt: session.expiresAt.toISOString(),
    ticketName: ticketNameForLocale(locale, targetAmount),
    canClaimReward,
    claimableAmount: canClaimReward ? targetAmount : 0,
  };
}

export type TemuTicketHistoryItem = {
  id: string;
  date: string;
  ticketName: string;
  condition: string;
  addedAmount: number;
};

export type TemuTicketHistory = {
  totalClaimed: number;
  items: TemuTicketHistoryItem[];
};

export type TemuTicketStatus = ReturnType<typeof buildSessionView>;

export type TemuTicketClaimResult = {
  claim: {
    id: string;
    addedAmount: number;
    condition: string;
    ticketName: string;
    claimedAt: string;
  };
  balance: string;
  status: TemuTicketStatus;
};

async function creditTemuReward(
  userId: string,
  session: InstanceType<typeof TemuTicketSession>,
  amount: number,
  locale: SupportedLocale,
  mongoSession: mongoose.ClientSession
): Promise<{ recordId: string; claimedAt: Date }> {
  if (amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No reward amount to claim');
  }

  const bonusAmount = roundMoney(amount);
  const turnoverRequired = roundMoney(bonusAmount * TEMU_TICKET_TURNOVER_MULTIPLIER);
  const userObjectId = new Types.ObjectId(userId);
  const ticketName = ticketNameForLocale(locale, session.targetAmount);
  const condition = conditionForLocale(locale);
  const claimedAt = new Date();

  const [record] = await TemuTicketRecord.create(
    [
      {
        userId: userObjectId,
        ticketName,
        condition,
        addedAmount: bonusAmount,
        claimedAt,
      },
    ],
    { session: mongoSession }
  );

  await LoginBonusTracking.create(
    [
      {
        userId: userObjectId,
        bonusAmount,
        depositAmount: 0,
        turnoverRequired,
        turnoverCompleted: 0,
        isCompleted: false,
      },
    ],
    { session: mongoSession }
  );

  const updatedBalance = await UserBalance.findOneAndUpdate(
    { userId: userObjectId },
    {
      $inc: {
        currentBalance: bonusAmount,
        walletRevision: 1,
      },
    },
    { new: true, session: mongoSession }
  );

  if (!updatedBalance) {
    throw new AppError(httpStatus.NOT_FOUND, 'User balance not found');
  }

  session.claimedToWallet = roundMoney(Number(session.claimedToWallet ?? 0) + bonusAmount);
  await session.save({ session: mongoSession });

  return { recordId: String(record._id), claimedAt };
}

export async function getTemuTicketStatus(
  userId: string,
  localeInput?: string
): Promise<TemuTicketStatus> {
  const locale = resolveLocale(localeInput);
  const session = await getOrCreateActiveSession(userId);
  return buildSessionView(session, locale);
}

export async function getTemuTicketHistory(userId: string): Promise<TemuTicketHistory> {
  const userObjectId = new Types.ObjectId(userId);

  const [totalRow, records] = await Promise.all([
    TemuTicketRecord.aggregate<{ total: number }>([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: '$addedAmount' } } },
    ]),
    TemuTicketRecord.find({ userId: userObjectId })
      .sort({ claimedAt: -1 })
      .limit(50)
      .lean(),
  ]);

  return {
    totalClaimed: roundMoney(Number(totalRow[0]?.total ?? 0)),
    items: records.map((row) => ({
      id: String(row._id),
      date: formatHistoryDate(new Date(row.claimedAt)),
      ticketName: row.ticketName,
      condition: row.condition,
      addedAmount: roundMoney(Number(row.addedAmount ?? 0)),
    })),
  };
}

export async function claimTemuReward(
  userId: string,
  localeInput?: string
): Promise<TemuTicketClaimResult> {
  const locale = resolveLocale(localeInput);
  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  try {
    const userObjectId = new Types.ObjectId(userId);
    const session = await TemuTicketSession.findOne({
      userId: userObjectId,
      status: 'active',
    })
      .sort({ createdAt: -1 })
      .session(mongoSession);

    if (!session) {
      throw new AppError(httpStatus.BAD_REQUEST, 'No active TEMU ticket found');
    }
    if (session.finalClaimed) {
      throw new AppError(httpStatus.CONFLICT, 'Reward already claimed');
    }
    if (Number(session.progressAmount) < Number(session.targetAmount)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Fill the target progress before claiming');
    }

    const rewardAmount = roundMoney(Number(session.targetAmount));

    const { recordId, claimedAt } = await creditTemuReward(
      userId,
      session,
      rewardAmount,
      locale,
      mongoSession
    );

    session.finalClaimed = true;
    session.status = 'completed';
    await session.save({ session: mongoSession });

    await mongoSession.commitTransaction();

    const balanceDoc = await UserBalance.findOne({ userId: userObjectId }).select('currentBalance');
    const status = buildSessionView(session, locale);

    return {
      claim: {
        id: recordId,
        addedAmount: rewardAmount,
        condition: conditionForLocale(locale),
        ticketName: status.ticketName,
        claimedAt: claimedAt.toISOString(),
      },
      balance: String(balanceDoc?.currentBalance ?? 0),
      status,
    };
  } catch (error) {
    await mongoSession.abortTransaction();
    throw error;
  } finally {
    mongoSession.endSession();
  }
}

export async function applyTemuReferralBoost(referrerUserId: string): Promise<void> {
  await expireStaleSessions(referrerUserId);
  const userObjectId = new Types.ObjectId(referrerUserId);

  const session = await TemuTicketSession.findOne({
    userId: userObjectId,
    status: 'active',
    finalClaimed: false,
  }).sort({ createdAt: -1 });

  if (!session) return;

  const boost = randomReferralBoost();
  session.progressAmount = roundMoney(
    Math.min(Number(session.targetAmount), Number(session.progressAmount) + boost)
  );
  session.inviteCount = Number(session.inviteCount ?? 0) + 1;
  await session.save();
}
