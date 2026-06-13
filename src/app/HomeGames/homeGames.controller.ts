import httpStatus from 'http-status';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import * as HomeGamesService from './homeGames.service';

export const getHomeGamesHandler = catchAsync(async (_req, res) => {
  const games = await HomeGamesService.getHomeGames();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Home games retrieved successfully',
    data: games,
  });
});

export const getHomeGamesManageHandler = catchAsync(async (_req, res) => {
  const games = await HomeGamesService.getAllHomeGamesForAdmin();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Home games fetched successfully',
    data: games,
  });
});

export const createHomeGameHandler = catchAsync(async (req, res) => {
  const game = await HomeGamesService.createHomeGame(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Home game created successfully',
    data: game,
  });
});

export const updateHomeGameHandler = catchAsync(async (req, res) => {
  const game = await HomeGamesService.updateHomeGame(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Home game updated successfully',
    data: game,
  });
});

export const deleteHomeGameHandler = catchAsync(async (req, res) => {
  await HomeGamesService.deleteHomeGame(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Home game deleted successfully',
    data: null,
  });
});
