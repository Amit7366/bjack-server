import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import { TPasswordResetStatus } from './passwordResetRequest.constant';
import * as PasswordResetRequestService from './passwordResetRequest.service';

export const createPasswordResetRequest = catchAsync(
  async (req: Request, res: Response) => {
    const result = await PasswordResetRequestService.createPasswordResetRequest(
      req.body,
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message:
        'Password reset request submitted. Please wait for admin approval.',
      data: result,
    });
  },
);

export const listPasswordResetRequests = catchAsync(
  async (req: Request, res: Response) => {
    const result = await PasswordResetRequestService.listPasswordResetRequests({
      status: req.query.status as TPasswordResetStatus | undefined,
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password reset requests fetched successfully',
      meta: result.meta,
      data: result.result,
    });
  },
);

export const approvePasswordResetRequest = catchAsync(
  async (req: Request, res: Response) => {
    const adminUserId = String(req.user?.objectId ?? '').trim();
    const result = await PasswordResetRequestService.approvePasswordResetRequest(
      req.params.id,
      adminUserId,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password reset approved. User can log in with the new password.',
      data: result,
    });
  },
);

export const rejectPasswordResetRequest = catchAsync(
  async (req: Request, res: Response) => {
    const adminUserId = String(req.user?.objectId ?? '').trim();
    const result = await PasswordResetRequestService.rejectPasswordResetRequest(
      req.params.id,
      adminUserId,
      req.body.adminNote,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password reset request rejected',
      data: result,
    });
  },
);
