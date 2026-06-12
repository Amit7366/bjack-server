import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import AppError from '../errors/AppError';
import { claimSignInReward, getSignInRewardStatus } from './signInReward.service';

function resolveUserId(req: Request): string {
  const userId = String(req.user?.objectId ?? '').trim();
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Login required');
  }
  return userId;
}

export const getSignInRewardStatusHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const data = await getSignInRewardStatus(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sign-in reward status fetched successfully',
    data,
  });
});

export const claimSignInRewardHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const data = await claimSignInReward(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sign-in reward claimed successfully',
    data,
  });
});
