// gameList.controller.ts
import { Request, Response } from 'express';
import * as GameService from './gameList.service';
import sendResponse from '../utilis/sendResponse';

function parseVendorQuery(vendor: unknown): string[] {
  if (typeof vendor !== 'string' || !vendor.trim()) return [];
  return [...new Set(vendor.split(',').map((s) => s.trim()).filter(Boolean))];
}

export const createGameHandler = async (req: Request, res: Response) => {
  const game = await GameService.createGame(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Game created successfully',
    data: game,
  });
};

export const getGameByIdHandler = async (req: Request, res: Response) => {
  const game = await GameService.getGameById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Game fetched successfully',
    data: game,
  });
};

export const updateGameHandler = async (req: Request, res: Response) => {
  const game = await GameService.updateGame(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Game updated successfully',
    data: game,
  });
};

export const deleteGameHandler = async (req: Request, res: Response) => {
  await GameService.deleteGame(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Game deleted successfully',
    data: null,
  });
};

export const getFilteredGamesHandler = async (req: Request, res: Response) => {
  const { provider, category: game_type } = req.query;

  const filter = {
    provider: provider?.toString(),
    game_type: game_type?.toString(),
  };

  const result = await GameService.getFilteredGames(filter);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Filtered games retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
};

export const getVendorGamesHandler = async (req: Request, res: Response) => {
  const vendorCodes = parseVendorQuery(req.query.vendor);
  const result = await GameService.getVendorGames(vendorCodes);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Vendor games retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
};

export const groupByProviderHandler = async (_req: Request, res: Response) => {
  const grouped = await GameService.groupByProvider();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Games grouped by provider with categories',
    data: grouped,
  });
};

export const groupByCategoryHandler = async (_req: Request, res: Response) => {
  const grouped = await GameService.groupByCategory();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Games grouped by category with providers',
    data: grouped,
  });
};
