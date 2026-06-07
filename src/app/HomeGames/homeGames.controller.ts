import { Request, Response } from 'express';
import * as HomeGamesService from './homeGames.service';
import sendResponse from '../utilis/sendResponse';

export const getHomeGamesHandler = async (_req: Request, res: Response) => {
  const games = await HomeGamesService.getHomeGames();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Home games retrieved successfully',
    data: games,
  });
};
