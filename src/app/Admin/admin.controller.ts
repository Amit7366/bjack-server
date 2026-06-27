import httpStatus from 'http-status';

import { AdminServices } from './admin.service';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import AppError from '../errors/AppError';
import { USER_ROLE } from '../User/user.constant';

const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.getSingleAdminFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is retrieved successfully',
    data: result,
  });
});

const getAllAdmins = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllAdminsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admins are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { admin } = req.body;
  console.log('from -controler', id, admin);
  const result = await AdminServices.updateAdminIntoDB(id, admin);
  // console.logf('from -controler',result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is updated successfully',
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log('controller', id);
  const result = await AdminServices.deleteAdminFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is deleted successfully',
    data: result,
  });
});
const getUserPromotionSummary = catchAsync(async (req, res) => {
  let userId = String(req.params.userId ?? '').trim();
  if (userId === 'me') {
    userId = String(req.user?.objectId ?? '').trim();
  }
  if (!userId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User id is required');
  }
  if (
    req.user?.role === USER_ROLE.user &&
    userId !== String(req.user.objectId)
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'You can only view your own turnover');
  }

  const summary = await AdminServices.getUserPromotionSummary(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Promotion summary fetched successfully!',
    data: summary,
  });
});
const giveSignupBonus = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const bonusAmount = req.body.bonusAmount;

  const result = await AdminServices.giveSignupBonus(userId, bonusAmount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

const giveDepositToUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const { amount, paymentMethod, promoCode } = req.body;

  const result = await AdminServices.giveDepositToUser(userId, {
    amount,
    paymentMethod,
    promoCode,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

const giveWithdrawToUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const { amount, walletId, paymentMethod, walletNumber, accountHolderName } = req.body;

  const result = await AdminServices.giveWithdrawToUser(userId, {
    amount,
    walletId,
    paymentMethod,
    walletNumber,
    accountHolderName,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

const getUserWalletsForAdmin = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await AdminServices.getUserWalletsForAdmin(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User wallets fetched successfully',
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const { status } = req.body;

  const result=await AdminServices.updateUserStatus(userId, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User status updated successfully',
    data: result,
  });
});
 const assignCustomerOfficer = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { officerId } = req.body;

  const result= await AdminServices.assignCustomerOfficer(userId, officerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer officer assigned successfully',
    data: result,
  });
});

const getMyUsers = catchAsync(async (req, res) => {
  const officerId = req.query.officerId as string;
if (!officerId) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Missing officerId in query params',
      data: null,
    });
  }
  const users = await AdminServices.getUsersAssignedToOfficer(officerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assigned users fetched successfully',
    data: users,
  });
});

const getSuccessfulTransactionRecord = catchAsync(async (req, res) => {
  const { type, transactionType } = req.query;

  const result = await AdminServices.getSuccessfulTransactionRecordFromDB({
    type: type as string,
    transactionType: transactionType as string,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successful transaction records fetched successfully!',
    data: result,
  });
});

const getDashboardOverview = catchAsync(async (req, res) => {
  const { from, to } = req.query;
  const result = await AdminServices.getDashboardOverviewFromDB(
    from as string | undefined,
    to as string | undefined,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard overview fetched successfully',
    data: result,
  });
});

const getAdvertiserDashboardOverview = catchAsync(async (req, res) => {
  const userId = String(req.user?.objectId ?? '').trim();
  if (!userId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User id is required');
  }

  const { from, to } = req.query;
  const result = await AdminServices.getAdvertiserDashboardOverviewFromDB(
    userId,
    from as string | undefined,
    to as string | undefined,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Advertiser dashboard overview fetched successfully',
    data: result,
  });
});

const getUsersWithHighBalance = catchAsync(async (req, res) => {
  const result = await AdminServices.getUsersWithHighBalanceFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users with balance less than 20 fetched successfully!',
    data: result,
  });
});
export const AdminControllers = {
  getAllAdmins,
  getSingleAdmin,
  deleteAdmin,
  updateAdmin,
  getUserPromotionSummary,
  giveSignupBonus,
  giveDepositToUser,
  giveWithdrawToUser,
  getUserWalletsForAdmin,
  updateUserStatus,
  assignCustomerOfficer,
  getMyUsers,
  getSuccessfulTransactionRecord,
  getUsersWithHighBalance,
  getDashboardOverview,
  getAdvertiserDashboardOverview,
};
