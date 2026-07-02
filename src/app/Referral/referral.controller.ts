import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import AppError from '../errors/AppError';
import { User } from '../User/user.model';
import { getMyReferralSummary, trackReferral } from './referral.service';
import { assertNotSelfReferralOnDevice } from './referralDeviceGuard';

export const referralSignupHandler = catchAsync(async (req: Request, res: Response) => {
  const { referredUserId, referrerId, deviceFingerprint } = req.body;

  if (!referredUserId || !referrerId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'referredUserId and referrerId are required');
  }

  if (!deviceFingerprint?.trim()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Device verification is required when tracking a referral.',
    );
  }

  const referrer = await User.findById(referrerId).select('referralId').lean();
  if (!referrer?.referralId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Referrer not found');
  }

  await assertNotSelfReferralOnDevice({
    referredBy: referrer.referralId,
    deviceFingerprint,
  });

  await trackReferral(referredUserId, referrerId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Referral tracked successfully',
    data: null,
  });
});

export const getMyReferralSummaryHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = String(req.user?.objectId ?? '').trim();
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Login required');
  }

  const summary = await getMyReferralSummary(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Referral summary fetched successfully',
    data: summary,
  });
});
