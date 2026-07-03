import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import AppError from '../errors/AppError';
import {
  claimRescueFund,
  countClaimableRescueFunds,
  getRescueFundStatus,
} from './rescueFund.service';

function requireUserId(req: Request): string {
  const userId = String(req.user?.objectId ?? '').trim();
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Login required');
  }
  return userId;
}

export const getRescueFundStatusHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const variant = String(req.params.variant ?? '').trim();
  const day = typeof req.query.day === 'string' ? req.query.day : undefined;

  const status = await getRescueFundStatus(userId, variant, day);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rescue fund status fetched successfully',
    data: status,
  });
});

export const claimRescueFundHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const variant = String(req.params.variant ?? '').trim();

  const result = await claimRescueFund(userId, variant);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rescue fund reward claimed successfully',
    data: result,
  });
});

export const getRescueFundSummaryHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const claimableCount = await countClaimableRescueFunds(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rescue fund summary fetched successfully',
    data: { claimableCount },
  });
});
