import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import { DepositPaymentAccount } from './depositPaymentAccount.model';
import { TDepositPaymentAccount } from './depositPaymentAccount.interface';
import { TPaymentMethod } from './depositPaymentAccount.constant';

const normalizeChannelId = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '');

const getAllAccountsFromDB = async () => {
  return DepositPaymentAccount.find().sort({ paymentMethod: 1, sortOrder: 1, createdAt: -1 }).lean();
};

const getActiveAccountsForDeposit = async () => {
  return DepositPaymentAccount.find({ isEnabled: true, isActive: true })
    .sort({ paymentMethod: 1, sortOrder: 1 })
    .lean();
};

const getEnabledAccountsForDeposit = async () => {
  return DepositPaymentAccount.find({ isEnabled: true })
    .sort({ paymentMethod: 1, sortOrder: 1, createdAt: -1 })
    .lean();
};

const createAccountIntoDB = async (payload: Partial<TDepositPaymentAccount>) => {
  const channelId = normalizeChannelId(payload.channelId ?? '');
  if (!channelId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid channel id');
  }

  const exists = await DepositPaymentAccount.findOne({
    paymentMethod: payload.paymentMethod,
    channelId,
  });
  if (exists) {
    throw new AppError(httpStatus.CONFLICT, 'Account for this method and channel already exists');
  }

  const created = await DepositPaymentAccount.create({
    ...payload,
    channelId,
    isEnabled: payload.isEnabled ?? true,
    isActive: false,
    recommended: payload.recommended ?? false,
    sortOrder: payload.sortOrder ?? 0,
  });

  return created;
};

const updateAccountIntoDB = async (id: string, payload: Partial<TDepositPaymentAccount>) => {
  const existing = await DepositPaymentAccount.findById(id);
  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment account not found');
  }

  const patch: Partial<TDepositPaymentAccount> = { ...payload };
  if (payload.channelId) {
    patch.channelId = normalizeChannelId(payload.channelId);
  }

  if (patch.channelId || patch.paymentMethod) {
    const method = patch.paymentMethod ?? existing.paymentMethod;
    const channelId = patch.channelId ?? existing.channelId;
    const duplicate = await DepositPaymentAccount.findOne({
      _id: { $ne: id },
      paymentMethod: method,
      channelId,
    });
    if (duplicate) {
      throw new AppError(httpStatus.CONFLICT, 'Account for this method and channel already exists');
    }
  }

  delete patch.isActive;

  const updated = await DepositPaymentAccount.findByIdAndUpdate(id, patch, {
    new: true,
    runValidators: true,
  });

  return updated;
};

const activateAccountIntoDB = async (id: string) => {
  const account = await DepositPaymentAccount.findById(id);
  if (!account) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment account not found');
  }

  if (!account.isEnabled) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Enable this account before activating it');
  }

  await DepositPaymentAccount.updateMany(
    { paymentMethod: account.paymentMethod, _id: { $ne: id } },
    { $set: { isActive: false } },
  );

  account.isActive = true;
  await account.save();

  return account;
};

const pauseAccountIntoDB = async (id: string) => {
  const account = await DepositPaymentAccount.findById(id);
  if (!account) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment account not found');
  }

  if (!account.isActive) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This account is not live');
  }

  account.isActive = false;
  await account.save();

  return account;
};

const deleteAccountFromDB = async (id: string) => {
  const deleted = await DepositPaymentAccount.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment account not found');
  }
  return deleted;
};

const resolveActiveAccountForMethod = async (paymentMethod: TPaymentMethod) => {
  return DepositPaymentAccount.findOne({
    paymentMethod,
    isEnabled: true,
    isActive: true,
  }).lean();
};

export const DepositPaymentAccountServices = {
  getAllAccountsFromDB,
  getActiveAccountsForDeposit,
  getEnabledAccountsForDeposit,
  createAccountIntoDB,
  updateAccountIntoDB,
  activateAccountIntoDB,
  pauseAccountIntoDB,
  deleteAccountFromDB,
  resolveActiveAccountForMethod,
};
