import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import AppError from '../errors/AppError';
import { getMyReferralSummary, trackReferral } from './referral.service';

export const referralSignupHandler = async (req: Request, res: Response) => {
  const { referredUserId, referrerId } = req.body;
  try {
    await trackReferral(referredUserId, referrerId);
    res.status(201).json({ message: 'Referral tracked and rewards applied.' });
  } catch (error) {
    res.status(500).json({ message: 'Error tracking referral', error });
  }
};

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


