import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import AppError from '../errors/AppError';
import { getPersonalReport } from './profitLoss.service';

function resolveUserId(req: Request): string {
  const userId = String(req.user?.objectId ?? '').trim();
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Login required');
  }
  return userId;
}

export const getPersonalReportHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const from = typeof req.query.from === 'string' ? req.query.from : undefined;
  const to = typeof req.query.to === 'string' ? req.query.to : undefined;
  const data = await getPersonalReport(userId, from, to);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Personal report fetched successfully',
    data,
  });
});
