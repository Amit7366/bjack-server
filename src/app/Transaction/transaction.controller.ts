// transaction.controller.ts
import httpStatus from 'http-status';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import { TransactionService } from './transaction.service';
import { Request, Response } from 'express';
import AppError from '../errors/AppError';
import { USER_ROLE } from '../User/user.constant';

const createManualDeposit = catchAsync(async (req: Request, res: Response) => {
  const body = { ...req.body };
  if (req.user?.role === USER_ROLE.user) {
    body.userId = req.user.objectId;
    body.id = req.user.id;
  }
  const result = await TransactionService.createManualDeposit(body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Manual deposit transaction created successfully!',
    data: result,
  });
});

const createManualWithdraw = catchAsync(async (req: Request, res: Response) => {
  const body = { ...req.body };
  if (req.user?.role === USER_ROLE.user) {
    body.userId = req.user.objectId;
    body.id = req.user.id;
    if (!body.accountHolderName?.trim()) {
      body.accountHolderName = req.user.userName || 'Member';
    }
    if (!body.transactionId?.trim()) {
      body.transactionId = 'sbm';
    }
  }
  const result = await TransactionService.createManualWithdraw(body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Manual withdraw transaction created successfully!',
    data: result,
  });
});

const approveWithdraw = catchAsync(async (req: Request, res: Response) => {
  const data = await TransactionService.markWithdrawSuccess(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Withdraw approved and balance updated!',
    data,
  });
});
const approveCoinWithdraw = catchAsync(async (req: Request, res: Response) => {
  const { userId, coinAmount } = req.query;

  if (!userId || !coinAmount) {
    throw new AppError
      (httpStatus.BAD_REQUEST, 'userId and coinAmount are required');
  }

  const data = await TransactionService.markCoinWithdrawSuccess(
    String(userId),
    Number(coinAmount)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coin withdrawal approved and balances updated!',
    data,
  });
});


const approveDeposit = catchAsync(async (req: Request, res: Response) => {
  const { promoCode } = req.body; // for first deposit only
  const data = await TransactionService.markDepositSuccess(req.params.id, promoCode);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Deposit approved and balance updated!',
    data,
  });
});

const getBalance = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.params.userId);
  const data = await TransactionService.getUserBalance(req.params.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User balance fetched successfully!',
    data,
  });
});
const updateStoreDbBalance = catchAsync(async (req, res) => {
  const { userId } = req.query;
  const { amount } = req.body; // expected: { "amount": 0 } or { "amount": 500 }

  const result = await TransactionService.updateStoreDbBalanceService(userId as string, Number(amount));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'storeDbBalance updated successfully',
    data: result,
  });
});
const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const data = await TransactionService.getAllTransactions(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transactions fetched successfully!',
    data,
  });
});

const getUserTransactions = catchAsync(async (req: Request, res: Response) => {
  const { userId, status, type, transactionType, from, to } = req.query;

  let resolvedUserId: string | undefined;

  if (req.user?.role === USER_ROLE.user) {
    resolvedUserId = req.user.objectId;
  } else if (userId && typeof userId === 'string') {
    resolvedUserId = userId;
  }

  if (!resolvedUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Missing or invalid userId');
  }

  const filters: Record<string, unknown> = { userId: resolvedUserId };

  const statusParam =
    (typeof status === 'string' && status) ||
    (typeof req.query.statuses === 'string' && req.query.statuses) ||
    undefined;
  if (statusParam) {
    filters.status = statusParam;
  }

  const typeParam =
    (typeof transactionType === 'string' && transactionType) ||
    (typeof type === 'string' && type) ||
    undefined;
  if (typeParam) {
    filters.transactionType = typeParam;
  }

  if (typeof from === 'string' && from) {
    filters.from = from;
  }
  if (typeof to === 'string' && to) {
    filters.to = to;
  }

  const result = await TransactionService.getUserTransactions(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User transactions fetched successfully',
    data: result,
  });
});



const rejectWithdraw = catchAsync(async (req: Request, res: Response) => {
  const data = await TransactionService.rejectWithdraw(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Withdraw rejected successfully!',
    data,
  });
});

const verifyAutoPayDeposit = catchAsync(async (req: Request, res: Response) => {
  const data = await TransactionService.verifyAutoPayDeposit(req.user!.objectId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: data.matched
      ? 'Deposit verified and credited'
      : 'Payment not found yet — still pending',
    data,
  });
});

const failAutoPayDeposit = catchAsync(async (req: Request, res: Response) => {
  const data = await TransactionService.failAutoPayDeposit(
    req.user!.objectId,
    req.body.depositTransactionId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Deposit marked as failed',
    data,
  });
});

export const TransactionController = {
  createManualDeposit,
  createManualWithdraw,
  approveCoinWithdraw,
  approveWithdraw,
  approveDeposit,
  getBalance,
  updateStoreDbBalance,
  getAllTransactions,
  getUserTransactions,
  rejectWithdraw,
  verifyAutoPayDeposit,
  failAutoPayDeposit,
};