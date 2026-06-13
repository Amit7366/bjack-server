import httpStatus from 'http-status';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import { DepositPaymentAccountServices } from './depositPaymentAccount.service';

const getActiveAccounts = catchAsync(async (_req, res) => {
  const result = await DepositPaymentAccountServices.getActiveAccountsForDeposit();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Active deposit payment accounts fetched successfully',
    data: result,
  });
});

const getEnabledAccounts = catchAsync(async (_req, res) => {
  const result = await DepositPaymentAccountServices.getEnabledAccountsForDeposit();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enabled deposit payment accounts fetched successfully',
    data: result,
  });
});

const getAllAccounts = catchAsync(async (_req, res) => {
  const result = await DepositPaymentAccountServices.getAllAccountsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Deposit payment accounts fetched successfully',
    data: result,
  });
});

const createAccount = catchAsync(async (req, res) => {
  const result = await DepositPaymentAccountServices.createAccountIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Deposit payment account created successfully',
    data: result,
  });
});

const updateAccount = catchAsync(async (req, res) => {
  const result = await DepositPaymentAccountServices.updateAccountIntoDB(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Deposit payment account updated successfully',
    data: result,
  });
});

const activateAccount = catchAsync(async (req, res) => {
  const result = await DepositPaymentAccountServices.activateAccountIntoDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Deposit payment account activated successfully',
    data: result,
  });
});

const pauseAccount = catchAsync(async (req, res) => {
  const result = await DepositPaymentAccountServices.pauseAccountIntoDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Deposit payment account paused successfully',
    data: result,
  });
});

const deleteAccount = catchAsync(async (req, res) => {
  const result = await DepositPaymentAccountServices.deleteAccountFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Deposit payment account deleted successfully',
    data: result,
  });
});

export const DepositPaymentAccountControllers = {
  getActiveAccounts,
  getEnabledAccounts,
  getAllAccounts,
  createAccount,
  updateAccount,
  activateAccount,
  pauseAccount,
  deleteAccount,
};
