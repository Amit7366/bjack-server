import { Request, Response } from 'express';
import * as ExclusiveGamesService from './exclusiveGames.service';
import sendResponse from '../utilis/sendResponse';

export const getExclusiveGamesHandler = async (_req: Request, res: Response) => {
  const slides = await ExclusiveGamesService.getExclusiveGames();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Exclusive carousel slides retrieved successfully',
    data: slides,
  });
};
