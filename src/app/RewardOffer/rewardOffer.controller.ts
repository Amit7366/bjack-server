import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import AppError from '../errors/AppError';
import {
  claimRewardOffer,
  createRewardOffer,
  deleteRewardOffer,
  getAllRewardOffersForAdmin,
  getMemberRewardOffers,
  updateRewardOffer,
} from './rewardOffer.service';

function resolveUserId(req: Request): string {
  const userId = String(req.user?.objectId ?? '').trim();
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Login required');
  }
  return userId;
}

export const getMemberRewardOffersHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const data = await getMemberRewardOffers(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reward offers fetched successfully',
    data,
  });
});

export const claimRewardOfferHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const data = await claimRewardOffer(userId, req.params.offerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reward offer claimed successfully',
    data,
  });
});

export const getAllRewardOffersAdminHandler = catchAsync(async (_req: Request, res: Response) => {
  const data = await getAllRewardOffersForAdmin();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reward offers fetched successfully',
    data,
  });
});

export const createRewardOfferHandler = catchAsync(async (req: Request, res: Response) => {
  const data = await createRewardOffer(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Reward offer created successfully',
    data,
  });
});

export const updateRewardOfferHandler = catchAsync(async (req: Request, res: Response) => {
  const data = await updateRewardOffer(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reward offer updated successfully',
    data,
  });
});

export const deleteRewardOfferHandler = catchAsync(async (req: Request, res: Response) => {
  const data = await deleteRewardOffer(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reward offer deleted successfully',
    data,
  });
});
