import httpStatus from 'http-status';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import * as ExclusiveGamesService from './exclusiveGames.service';

export const getExclusiveGamesHandler = catchAsync(async (_req, res) => {
  const slides = await ExclusiveGamesService.getExclusiveGames();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Exclusive carousel slides retrieved successfully',
    data: slides,
  });
});

export const getExclusiveGamesManageHandler = catchAsync(async (_req, res) => {
  const slides = await ExclusiveGamesService.getAllExclusiveGamesForAdmin();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Exclusive games fetched successfully',
    data: slides,
  });
});

export const createExclusiveGameHandler = catchAsync(async (req, res) => {
  const slide = await ExclusiveGamesService.createExclusiveGame(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Exclusive game created successfully',
    data: slide,
  });
});

export const updateExclusiveGameHandler = catchAsync(async (req, res) => {
  const slide = await ExclusiveGamesService.updateExclusiveGame(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Exclusive game updated successfully',
    data: slide,
  });
});

export const deleteExclusiveGameHandler = catchAsync(async (req, res) => {
  await ExclusiveGamesService.deleteExclusiveGame(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Exclusive game deleted successfully',
    data: null,
  });
});
