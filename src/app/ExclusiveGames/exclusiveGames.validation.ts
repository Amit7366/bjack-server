import { z } from 'zod';
import { GAME_TYPES } from '../Game/game.constants';

const gameTypeSchema = z.enum(GAME_TYPES);

const exclusiveGameBody = z.object({
  image: z.string().trim().optional(),
  gameId: z.string().trim().max(120).optional(),
  gameCode: z.string().trim().max(120).optional(),
  title: z.string().trim().max(200).optional(),
  game_type: gameTypeSchema.optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
});

export const createExclusiveGameSchema = z.object({
  body: exclusiveGameBody,
});

export const updateExclusiveGameSchema = z.object({
  body: exclusiveGameBody.partial(),
});
