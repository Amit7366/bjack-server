import httpStatus from 'http-status';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import AppError from '../errors/AppError';
import { PartnerCommissionService } from './partnerCommission.service';

const getMyWallet = catchAsync(async (req, res) => {
  const userId = String(req.user?.objectId ?? '').trim();
  if (!userId) throw new AppError(httpStatus.BAD_REQUEST, 'User id is required');

  const result = await PartnerCommissionService.getPartnerWallet(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Partner wallet fetched successfully',
    data: result,
  });
});

const getMyCommissionLedger = catchAsync(async (req, res) => {
  const userId = String(req.user?.objectId ?? '').trim();
  if (!userId) throw new AppError(httpStatus.BAD_REQUEST, 'User id is required');

  const result = await PartnerCommissionService.getPartnerLedgerFromDB(userId, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Commission ledger fetched successfully',
    meta: result.meta,
    data: result.result,
  });
});

const createMyWithdrawRequest = catchAsync(async (req, res) => {
  const userId = String(req.user?.objectId ?? '').trim();
  if (!userId) throw new AppError(httpStatus.BAD_REQUEST, 'User id is required');

  const result = await PartnerCommissionService.createWithdrawRequest(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Withdraw request submitted successfully',
    data: result,
  });
});

const getMyWithdrawRequests = catchAsync(async (req, res) => {
  const userId = String(req.user?.objectId ?? '').trim();
  if (!userId) throw new AppError(httpStatus.BAD_REQUEST, 'User id is required');

  const result = await PartnerCommissionService.getPartnerWithdrawRequestsFromDB(
    userId,
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Withdraw requests fetched successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getCommissionSettings = catchAsync(async (req, res) => {
  const result = await PartnerCommissionService.getCommissionSettings();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Commission settings fetched successfully',
    data: result,
  });
});

const updateCommissionSettings = catchAsync(async (req, res) => {
  const { defaultCommissionRate } = req.body;
  const result = await PartnerCommissionService.updateCommissionSettings(defaultCommissionRate);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Commission settings updated successfully',
    data: result,
  });
});

const getAllWithdrawRequests = catchAsync(async (req, res) => {
  const result = await PartnerCommissionService.getPartnerWithdrawRequestsFromDB(
    null,
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Partner withdraw requests fetched successfully',
    meta: result.meta,
    data: result.result,
  });
});

const approveWithdrawRequest = catchAsync(async (req, res) => {
  const adminId = String(req.user?.objectId ?? '').trim();
  const result = await PartnerCommissionService.approveWithdrawRequest(
    req.params.id,
    adminId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Withdraw request approved successfully',
    data: result,
  });
});

const rejectWithdrawRequest = catchAsync(async (req, res) => {
  const adminId = String(req.user?.objectId ?? '').trim();
  const result = await PartnerCommissionService.rejectWithdrawRequest(
    req.params.id,
    adminId,
    req.body.adminNote,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Withdraw request rejected successfully',
    data: result,
  });
});

export const PartnerCommissionControllers = {
  getMyWallet,
  getMyCommissionLedger,
  createMyWithdrawRequest,
  getMyWithdrawRequests,
  getCommissionSettings,
  updateCommissionSettings,
  getAllWithdrawRequests,
  approveWithdrawRequest,
  rejectWithdrawRequest,
};
