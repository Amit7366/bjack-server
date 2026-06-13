import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import { HomeGameModel } from '../../models/HomeGameModel';

export const getHomeGames = async () => {
  const games = await HomeGameModel.find().sort({ sortOrder: 1 }).lean();
  return games.map((g) => ({
    id: g.gameId,
    title: g.title,
    providerKey: g.providerKey,
    providerLabel: g.providerLabel,
    gameCode: g.gameCode,
    game_type: g.game_type ?? 'slot',
    gradient: g.gradient,
    glow: g.glow,
    emoji: g.emoji,
    image: g.image,
  }));
};

export const getAllHomeGamesForAdmin = async () => {
  return HomeGameModel.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
};

export const createHomeGame = async (payload: Record<string, unknown>) => {
  const gameId = String(payload.gameId ?? '').trim();
  const exists = await HomeGameModel.findOne({ gameId });
  if (exists) {
    throw new AppError(httpStatus.CONFLICT, 'A home game with this gameId already exists');
  }

  return HomeGameModel.create({
    ...payload,
    gameId,
    game_type: payload.game_type ?? 'slot',
    sortOrder: payload.sortOrder ?? 0,
  });
};

export const updateHomeGame = async (id: string, payload: Record<string, unknown>) => {
  const existing = await HomeGameModel.findById(id);
  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, 'Home game not found');
  }

  if (payload.gameId) {
    const gameId = String(payload.gameId).trim();
    const duplicate = await HomeGameModel.findOne({ gameId, _id: { $ne: id } });
    if (duplicate) {
      throw new AppError(httpStatus.CONFLICT, 'A home game with this gameId already exists');
    }
    payload.gameId = gameId;
  }

  return HomeGameModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
};

export const deleteHomeGame = async (id: string) => {
  const deleted = await HomeGameModel.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Home game not found');
  }
  return deleted;
};
