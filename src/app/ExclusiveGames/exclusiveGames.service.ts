import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import { ExclusiveGameModel } from '../../models/ExclusiveGameModel';

export const getExclusiveGames = async () => {
  const slides = await ExclusiveGameModel.find().sort({ sortOrder: 1 }).lean();
  return slides.map((s) => ({
    image: s.image,
    gameId: s.gameId,
    gameCode: s.gameCode,
    title: s.title,
    game_type: s.game_type ?? 'slot',
  }));
};

export const getAllExclusiveGamesForAdmin = async () => {
  return ExclusiveGameModel.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
};

export const createExclusiveGame = async (payload: Record<string, unknown>) => {
  return ExclusiveGameModel.create({
    ...payload,
    game_type: payload.game_type ?? 'slot',
    sortOrder: payload.sortOrder ?? 0,
  });
};

export const updateExclusiveGame = async (id: string, payload: Record<string, unknown>) => {
  const existing = await ExclusiveGameModel.findById(id);
  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, 'Exclusive game not found');
  }

  return ExclusiveGameModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
};

export const deleteExclusiveGame = async (id: string) => {
  const deleted = await ExclusiveGameModel.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Exclusive game not found');
  }
  return deleted;
};
