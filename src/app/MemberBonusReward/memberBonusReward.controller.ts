import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import AppError from '../errors/AppError';
import {
  claimMemberBonusReward,
  getMemberBonusRewardStatus,
} from './memberBonusReward.service';

function resolveUserId(req: Request): string {
  const userId = String(req.user?.objectId ?? '').trim();
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Login required');
  }
  return userId;
}

export const getMemberBonusRewardStatusHandler = catchAsync(
  async (req: Request, res: Response) => {
    const userId = resolveUserId(req);
    const data = await getMemberBonusRewardStatus(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Member bonus status fetched successfully',
      data,
    });
  }
);

export const claimMemberBonusRewardHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const data = await claimMemberBonusReward(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Member bonus claimed successfully',
    data,
  });
});
