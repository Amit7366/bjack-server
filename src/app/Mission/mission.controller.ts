import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import AppError from '../errors/AppError';
import { listMissionsForUser, countAvailableMissions, type MissionTab } from './mission.service';

const VALID_TABS = new Set<MissionTab>(['running', 'coming-soon', 'closed']);

function parseTab(value: unknown): MissionTab {
  const tab = String(value ?? 'running').trim() as MissionTab;
  if (!VALID_TABS.has(tab)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid mission tab');
  }
  return tab;
}

export const listMissionsHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = String(req.user?.objectId ?? '').trim();
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Login required');
  }

  const tab = parseTab(req.query.tab);
  const locale = String(req.query.locale ?? 'en');

  const items = await listMissionsForUser(userId, tab, locale);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Missions fetched successfully',
    data: { tab, items },
  });
});

export const getMissionSummaryHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = String(req.user?.objectId ?? '').trim();
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Login required');
  }

  const availableCount = await countAvailableMissions(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mission summary fetched successfully',
    data: { availableCount },
  });
});
