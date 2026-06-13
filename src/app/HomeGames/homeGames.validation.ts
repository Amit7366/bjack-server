import { z } from 'zod';
import { GAME_TYPES, PROVIDER_KEYS } from '../Game/game.constants';

const gameTypeSchema = z.enum(GAME_TYPES);
const providerKeySchema = z.enum(PROVIDER_KEYS as [string, ...string[]]);

const homeGameBody = z.object({
  gameId: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(200),
  providerKey: providerKeySchema,
  providerLabel: z.string().trim().min(1).max(120),
  gameCode: z.string().trim().max(120).optional(),
  game_type: gameTypeSchema.optional(),
  gradient: z.string().trim().min(1).max(200),
  glow: z.string().trim().min(1).max(40),
  emoji: z.string().trim().max(16).optional(),
  image: z.string().trim().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
});

export const createHomeGameSchema = z.object({
  body: homeGameBody,
});

export const updateHomeGameSchema = z.object({
  body: homeGameBody.partial(),
});
