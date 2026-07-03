import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import AppError from '../errors/AppError';
import {
  claimTemuReward,
  getTemuTicketHistory,
  getTemuTicketStatus,
} from './temuTicket.service';

function requireUserId(req: Request): string {
  const userId = String(req.user?.objectId ?? '').trim();
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Login required');
  }
  return userId;
}

export const getTemuTicketStatusHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const locale = String(req.query.locale ?? 'en');
  const status = await getTemuTicketStatus(userId, locale);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TEMU ticket status fetched successfully',
    data: status,
  });
});

export const getTemuTicketHistoryHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const history = await getTemuTicketHistory(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TEMU ticket history fetched successfully',
    data: history,
  });
});

export const claimTemuRewardHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = requireUserId(req);
  const locale = String(req.body?.locale ?? req.query.locale ?? 'en');
  const result = await claimTemuReward(userId, locale);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TEMU ticket reward claimed successfully',
    data: result,
  });
});
