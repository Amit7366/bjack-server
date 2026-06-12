import httpStatus from 'http-status';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import { Request, Response } from 'express';
import AppError from '../errors/AppError';
import {
  checkGameLaunchEligibility,
  getActiveGameRestrictions,
} from './gameEligibility.service';

const checkLaunch = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.objectId;
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const gameCode = String(req.query.gameCode ?? req.body?.gameCode ?? '').trim();
  if (!gameCode) {
    throw new AppError(httpStatus.BAD_REQUEST, 'gameCode is required');
  }

  const result = await checkGameLaunchEligibility(userId, gameCode);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.allowed ? 'Game launch allowed' : 'Game launch restricted',
    data: result,
  });
});

const getActiveRestrictions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.objectId;
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const data = await getActiveGameRestrictions(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Active game restrictions loaded',
    data,
  });
});

export const GameEligibilityController = {
  checkLaunch,
  getActiveRestrictions,
};
