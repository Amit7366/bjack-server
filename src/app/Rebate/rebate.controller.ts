import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import AppError from '../errors/AppError';
import {
  claimDailyRebate,
  getManualRebate,
  getRebateHistory,
} from './rebate.service';

function resolveUserId(req: Request): string {
  const userId = String(req.user?.objectId ?? '').trim();
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Login required');
  }
  return userId;
}

export const getManualRebateHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const day = typeof req.query.day === 'string' ? req.query.day : undefined;
  const data = await getManualRebate(userId, day);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Manual rebate fetched successfully',
    data,
  });
});

export const claimDailyRebateHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const data = await claimDailyRebate(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rebate claimed successfully',
    data,
  });
});

export const getRebateHistoryHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const from = typeof req.query.from === 'string' ? req.query.from : undefined;
  const to = typeof req.query.to === 'string' ? req.query.to : undefined;
  const page = Number(req.query.page ?? 1);

  const data = await getRebateHistory(userId, from, to, page);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rebate history fetched successfully',
    data,
  });
});
