// src/UserWallet/userWallet.controller.ts

import { Request, Response } from 'express';
import * as WalletService from './userWallet.service';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';

export const createWalletHandler = catchAsync(async (req: Request, res: Response) => {
  const wallet = await WalletService.createUserWallet(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Wallet created successfully',
    data: wallet,
  });
});

export const getUserWalletsHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const wallets = await WalletService.getUserWallets(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User wallets fetched successfully',
    data: wallets,
  });
});

export const getWalletByIdHandler = catchAsync(async (req: Request, res: Response) => {
  const wallet = await WalletService.getUserWalletById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Wallet fetched successfully',
    data: wallet,
  });
});

export const updateWalletHandler = catchAsync(async (req: Request, res: Response) => {
  const wallet = await WalletService.updateUserWallet(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Wallet updated successfully',
    data: wallet,
  });
});

export const deleteWalletHandler = catchAsync(async (req: Request, res: Response) => {
  await WalletService.deleteUserWallet(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Wallet deleted successfully',
    data: null,
  });
});
