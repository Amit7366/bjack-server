import httpStatus from 'http-status';
import { Request, Response } from 'express';
import AppError from '../errors/AppError';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import { KycServices } from './kyc.service';
import { TKycStatus } from './kyc.constant';

const submitKyc = catchAsync(async (req: Request, res: Response) => {
  const userId = String(req.user?.objectId ?? '').trim();
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Login required');
  }

  const files = req.files as {
    front?: Express.Multer.File[];
    back?: Express.Multer.File[];
    selfie?: Express.Multer.File[];
  };

  const result = await KycServices.submitKycDocuments(
    userId,
    {
      documentType: req.body.documentType,
      documentNo: req.body.documentNo,
      documentExpiry: req.body.documentExpiry,
    },
    files,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'KYC documents submitted successfully',
    data: result,
  });
});

const getMyKyc = catchAsync(async (req: Request, res: Response) => {
  const userId = String(req.user?.objectId ?? '').trim();
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Login required');
  }

  const result = await KycServices.getMyKycStatus(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'KYC status fetched successfully',
    data: result,
  });
});

const listKycSubmissions = catchAsync(async (req: Request, res: Response) => {
  const result = await KycServices.listKycSubmissions({
    status: req.query.status as TKycStatus | undefined,
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'KYC submissions fetched successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getKycSubmission = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await KycServices.getKycSubmissionForAdmin(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'KYC submission fetched successfully',
    data: result,
  });
});

const updateKycStatus = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { status, note } = req.body;

  const result = await KycServices.updateKycStatusForAdmin(userId, status, note);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `KYC ${status} successfully`,
    data: result,
  });
});

export const KycControllers = {
  submitKyc,
  getMyKyc,
  listKycSubmissions,
  getKycSubmission,
  updateKycStatus,
};
