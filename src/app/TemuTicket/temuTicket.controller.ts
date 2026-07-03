import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import AppError from '../errors/AppError';
import { getTemuTicketHistory } from './temuTicket.service';

export const getTemuTicketHistoryHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = String(req.user?.objectId ?? '').trim();
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Login required');
  }

  const history = await getTemuTicketHistory(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TEMU ticket history fetched successfully',
    data: history,
  });
});
