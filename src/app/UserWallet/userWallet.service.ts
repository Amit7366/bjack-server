// src/UserWallet/userWallet.service.ts

import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import { UserWallet } from './userWallet.model';

export const MAX_WALLETS_PER_USER = 5;

export const createUserWallet = async (payload: any) => {
  const walletCount = await UserWallet.countDocuments({ userId: payload.userId });
  if (walletCount >= MAX_WALLETS_PER_USER) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can save a maximum of ${MAX_WALLETS_PER_USER} wallets`
    );
  }

  const duplicate = await UserWallet.findOne({
    userId: payload.userId,
    walletNumber: payload.walletNumber,
  });
  if (duplicate) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This wallet number is already saved');
  }

  if (payload.isDefault) {
    // unset any existing default wallets for the user
    await UserWallet.updateMany(
      { userId: payload.userId },
      { isDefault: false }
    );
  }

  return await UserWallet.create(payload);
};

export const getUserWallets = async (userId: string) => {
  return await UserWallet.find({ userId }).sort({ createdAt: -1 });
};

export const getUserWalletById = async (id: string) => {
  return await UserWallet.findById(id);
};

export const updateUserWallet = async (id: string, payload: any) => {
  const updated = await UserWallet.findByIdAndUpdate(id, payload, { new: true });

  // if setting as default, update others
  if (payload.isDefault && updated) {
    await UserWallet.updateMany(
      { userId: updated.userId, _id: { $ne: updated._id } },
      { isDefault: false }
    );
  }

  return updated;
};

export const deleteUserWallet = async (id: string) => {
  return await UserWallet.findByIdAndDelete(id);
};
