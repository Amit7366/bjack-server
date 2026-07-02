import httpStatus from 'http-status';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import AppError from '../errors/AppError';
import { AdvertiserServices } from './advertiser.service';

const getAllAdvertisers = catchAsync(async (req, res) => {
  const result = await AdvertiserServices.getAllAdvertisersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Partners are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleAdvertiser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdvertiserServices.getSingleAdvertiserFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Partner is retrieved successfully',
    data: result,
  });
});

const createAdvertiser = catchAsync(async (req, res) => {
  const { password, advertiser } = req.body;
  const result = await AdvertiserServices.createAdvertiserIntoDB(password, advertiser);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Partner is created successfully',
    data: result,
  });
});

const updateAdvertiser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { password, advertiser } = req.body;
  const result = await AdvertiserServices.updateAdvertiserIntoDB(id, advertiser, password);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Partner is updated successfully',
    data: result,
  });
});

const deleteAdvertiser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdvertiserServices.deleteAdvertiserFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Partner is deleted successfully',
    data: result,
  });
});

const getAdvertiserDashboardOverview = catchAsync(async (req, res) => {
  const userId = String(req.user?.objectId ?? '').trim();
  if (!userId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User id is required');
  }

  const { from, to } = req.query;
  const result = await AdvertiserServices.getAdvertiserDashboardOverviewFromDB(
    userId,
    from as string | undefined,
    to as string | undefined,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Partner dashboard overview fetched successfully',
    data: result,
  });
});

export const AdvertiserControllers = {
  getAllAdvertisers,
  getSingleAdvertiser,
  createAdvertiser,
  updateAdvertiser,
  deleteAdvertiser,
  getAdvertiserDashboardOverview,
};
