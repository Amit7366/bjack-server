import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import AppError from '../errors/AppError';
import QueryBuilder from '../builder/QueryBuilder';
import { User } from '../User/user.model';
import { USER_ROLE } from '../User/user.constant';
import { assertAccountActiveForRestrictedAction } from '../User/userAccountStatus.util';
import { ReferralModel } from '../Referral/referral.model';
import { Advertiser } from '../Advertiser/advertiser.model';
import { ITransaction } from '../Transaction/transaction.interface';
import { PartnerBalance } from './partnerBalance.model';
import { PartnerCommissionLedger } from './partnerCommissionLedger.model';
import { PartnerWithdrawRequest } from './partnerWithdrawRequest.model';
import { PartnerCommissionSettings } from './partnerCommissionSettings.model';
import {
  TPartnerCommissionLedgerType,
  TPartnerPaymentMethod,
} from './partnerCommission.interface';

const DEFAULT_COMMISSION_RATE = 0.35;

async function getGlobalCommissionRate(): Promise<number> {
  const settings = await PartnerCommissionSettings.findOne({ key: 'global' }).lean();
  if (settings?.defaultCommissionRate != null) {
    return settings.defaultCommissionRate;
  }
  await PartnerCommissionSettings.findOneAndUpdate(
    { key: 'global' },
    { $setOnInsert: { defaultCommissionRate: DEFAULT_COMMISSION_RATE } },
    { upsert: true, new: true },
  );
  return DEFAULT_COMMISSION_RATE;
}

async function getCommissionRateForPartner(partnerUserId: string): Promise<number> {
  const advertiser = await Advertiser.findOne({ user: partnerUserId })
    .select('commissionRate')
    .lean();
  if (advertiser?.commissionRate != null) {
    return advertiser.commissionRate;
  }
  return getGlobalCommissionRate();
}

async function resolveAdvertiserReferrer(
  referredUserId: Types.ObjectId | string,
): Promise<{ partnerUserId: Types.ObjectId; partnerId: string } | null> {
  const referredOid =
    referredUserId instanceof Types.ObjectId
      ? referredUserId
      : new Types.ObjectId(String(referredUserId));

  const pair = await ReferralModel.findOne({ referredUser: referredOid }).lean();
  if (!pair?.referrer) return null;

  const referrer = await User.findById(pair.referrer).select('role id status').lean();
  if (!referrer || referrer.role !== USER_ROLE.advertiser) return null;
  // Paused partners (non-active) do not earn commission
  if (referrer.status && referrer.status !== 'active') return null;

  const advertiser = await Advertiser.findOne({ user: pair.referrer }).select('id').lean();
  if (!advertiser) return null;

  return {
    partnerUserId: pair.referrer as Types.ObjectId,
    partnerId: advertiser.id,
  };
}

async function ensurePartnerBalance(
  partnerUserId: Types.ObjectId,
  partnerId: string,
  session?: mongoose.ClientSession,
) {
  const existing = await PartnerBalance.findOne({ userId: partnerUserId }).session(
    session ?? null,
  );
  if (existing) return existing;

  const [created] = await PartnerBalance.create(
    [
      {
        userId: partnerUserId,
        partnerId,
        currentBalance: 0,
        totalEarned: 0,
        totalDeducted: 0,
        totalWithdrawn: 0,
      },
    ],
    { session },
  );
  return created;
}

async function applyCommission(
  trx: ITransaction & { _id: Types.ObjectId },
  type: TPartnerCommissionLedgerType,
  amountSign: 1 | -1,
) {
  const referrer = await resolveAdvertiserReferrer(trx.userId);
  if (!referrer) return;

  const existing = await PartnerCommissionLedger.findOne({
    sourceTransactionId: trx._id,
    type,
  }).lean();
  if (existing) return;

  const rate = await getCommissionRateForPartner(String(referrer.partnerUserId));
  const baseAmount = Number(trx.amount);
  const commissionAmount = Math.round(baseAmount * rate * 100) / 100;
  if (commissionAmount <= 0) return;

  const signedAmount = commissionAmount * amountSign;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await ensurePartnerBalance(
      referrer.partnerUserId,
      referrer.partnerId,
      session,
    );

    const balanceUpdate =
      amountSign === 1
        ? {
            $inc: {
              currentBalance: signedAmount,
              totalEarned: commissionAmount,
            },
          }
        : {
            $inc: {
              currentBalance: signedAmount,
              totalDeducted: commissionAmount,
            },
          };

    const updated = await PartnerBalance.findOneAndUpdate(
      { userId: referrer.partnerUserId },
      balanceUpdate,
      { new: true, session },
    );

    if (!updated) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update partner balance');
    }

    await PartnerCommissionLedger.create(
      [
        {
          partnerUserId: referrer.partnerUserId,
          type,
          amount: signedAmount,
          commissionRate: rate,
          baseAmount,
          referredUserId: trx.userId,
          sourceTransactionId: trx._id,
          balanceAfter: updated.currentBalance,
        },
      ],
      { session },
    );

    await session.commitTransaction();
  } catch (err: unknown) {
    await session.abortTransaction();
    const mongoErr = err as { code?: number };
    if (mongoErr?.code === 11000) return;
    throw err;
  } finally {
    session.endSession();
  }
}

const applyDepositCommission = async (trx: ITransaction & { _id: Types.ObjectId }) => {
  await applyCommission(trx, 'deposit_commission', 1);
};

const applyWithdrawCommission = async (trx: ITransaction & { _id: Types.ObjectId }) => {
  await applyCommission(trx, 'withdraw_commission', -1);
};

const getPartnerWallet = async (partnerUserId: string) => {
  await assertAccountActiveForRestrictedAction(partnerUserId);

  const [balance, commissionRate] = await Promise.all([
    PartnerBalance.findOne({ userId: partnerUserId }).lean(),
    getCommissionRateForPartner(partnerUserId),
  ]);

  return {
    currentBalance: balance?.currentBalance ?? 0,
    totalEarned: balance?.totalEarned ?? 0,
    totalDeducted: balance?.totalDeducted ?? 0,
    totalWithdrawn: balance?.totalWithdrawn ?? 0,
    commissionRate,
  };
};

const getPartnerLedgerFromDB = async (
  partnerUserId: string,
  query: Record<string, unknown>,
) => {
  await assertAccountActiveForRestrictedAction(partnerUserId);

  const ledgerQuery = new QueryBuilder(
    PartnerCommissionLedger.find({ partnerUserId }).sort({ createdAt: -1 }),
    query,
  )
    .paginate()
    .fields();

  const result = await ledgerQuery.modelQuery;
  const meta = await ledgerQuery.countTotal();
  return { result, meta };
};

const getPartnerWithdrawRequestsFromDB = async (
  partnerUserId: string | null,
  query: Record<string, unknown>,
) => {
  // Only gate partner self-service; admin listing passes null
  if (partnerUserId) {
    await assertAccountActiveForRestrictedAction(partnerUserId);
  }

  const filter = partnerUserId ? { partnerUserId } : {};
  const requestQuery = new QueryBuilder(
    PartnerWithdrawRequest.find(filter)
      .populate({
        path: 'partnerUserId',
        select: 'userName id',
        options: { strictPopulate: false },
      })
      .sort({ createdAt: -1 }),
    query,
  )
    .filter()
    .paginate()
    .fields();

  const result = await requestQuery.modelQuery;
  const meta = await requestQuery.countTotal();
  return { result, meta };
};

const createWithdrawRequest = async (
  partnerUserId: string,
  payload: {
    amount: number;
    paymentMethod: TPartnerPaymentMethod;
    walletNumber: string;
    accountHolderName: string;
  },
) => {
  await assertAccountActiveForRestrictedAction(partnerUserId);

  const amount = Number(payload.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Withdraw amount must be greater than zero');
  }

  const advertiser = await Advertiser.findOne({ user: partnerUserId }).lean();
  if (!advertiser) {
    throw new AppError(httpStatus.NOT_FOUND, 'Partner profile not found');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const balance = await ensurePartnerBalance(
      new Types.ObjectId(partnerUserId),
      advertiser.id,
      session,
    );

    if (balance.currentBalance < amount) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Insufficient balance. Available: ${balance.currentBalance.toFixed(2)} TK`,
      );
    }

    const pendingCount = await PartnerWithdrawRequest.countDocuments({
      partnerUserId,
      status: 'pending',
    }).session(session);

    if (pendingCount > 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'You already have a pending withdraw request',
      );
    }

    const updated = await PartnerBalance.findOneAndUpdate(
      { userId: partnerUserId, currentBalance: { $gte: amount } },
      { $inc: { currentBalance: -amount } },
      { new: true, session },
    );

    if (!updated) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
    }

    const [request] = await PartnerWithdrawRequest.create(
      [
        {
          partnerUserId,
          amount,
          status: 'pending',
          paymentMethod: payload.paymentMethod,
          walletNumber: payload.walletNumber.trim(),
          accountHolderName: payload.accountHolderName.trim(),
        },
      ],
      { session },
    );

    await session.commitTransaction();
    return request;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const approveWithdrawRequest = async (requestId: string, adminUserId: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const request = await PartnerWithdrawRequest.findById(requestId).session(session);
    if (!request || request.status !== 'pending') {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or already processed request');
    }

    request.status = 'approved';
    request.processedBy = new Types.ObjectId(adminUserId);
    request.processedAt = new Date();
    await request.save({ session });

    await PartnerBalance.findOneAndUpdate(
      { userId: request.partnerUserId },
      { $inc: { totalWithdrawn: request.amount } },
      { session },
    );

    await session.commitTransaction();
    return request;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const rejectWithdrawRequest = async (
  requestId: string,
  adminUserId: string,
  adminNote?: string,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const request = await PartnerWithdrawRequest.findById(requestId).session(session);
    if (!request || request.status !== 'pending') {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or already processed request');
    }

    request.status = 'rejected';
    request.processedBy = new Types.ObjectId(adminUserId);
    request.processedAt = new Date();
    if (adminNote) request.adminNote = adminNote.trim();
    await request.save({ session });

    await PartnerBalance.findOneAndUpdate(
      { userId: request.partnerUserId },
      { $inc: { currentBalance: request.amount } },
      { session },
    );

    await session.commitTransaction();
    return request;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const getCommissionSettings = async () => {
  const rate = await getGlobalCommissionRate();
  return { defaultCommissionRate: rate };
};

const updateCommissionSettings = async (defaultCommissionRate: number) => {
  if (defaultCommissionRate < 0 || defaultCommissionRate > 1) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Commission rate must be between 0 and 1');
  }

  const settings = await PartnerCommissionSettings.findOneAndUpdate(
    { key: 'global' },
    { $set: { defaultCommissionRate } },
    { upsert: true, new: true },
  );
  return settings;
};

const initPartnerBalanceOnCreate = async (
  partnerUserId: Types.ObjectId,
  partnerId: string,
  session?: mongoose.ClientSession,
) => {
  await PartnerBalance.findOneAndUpdate(
    { userId: partnerUserId },
    {
      $setOnInsert: {
        userId: partnerUserId,
        partnerId,
        currentBalance: 0,
        totalEarned: 0,
        totalDeducted: 0,
        totalWithdrawn: 0,
      },
    },
    { upsert: true, session },
  );
};

export const PartnerCommissionService = {
  getGlobalCommissionRate,
  getCommissionRateForPartner,
  applyDepositCommission,
  applyWithdrawCommission,
  getPartnerWallet,
  getPartnerLedgerFromDB,
  getPartnerWithdrawRequestsFromDB,
  createWithdrawRequest,
  approveWithdrawRequest,
  rejectWithdrawRequest,
  getCommissionSettings,
  updateCommissionSettings,
  initPartnerBalanceOnCreate,
};
