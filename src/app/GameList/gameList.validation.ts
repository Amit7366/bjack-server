import { z } from 'zod';
import { GAME_TYPES, PROVIDER_KEYS, VENDOR_CODE_VALUES } from '../Game/game.constants';

const gameTypeSchema = z.enum(GAME_TYPES);
const providerKeySchema = z.enum(PROVIDER_KEYS as [string, ...string[]]);

export const createGameValidation = z.object({
  body: z.object({
    tileId: z.string().trim().min(1),
    title: z.string().trim().min(1),
    providerKey: providerKeySchema,
    providerLabel: z.string().trim().min(1),
    gameCode: z.string().trim().optional(),
    gradient: z.string().trim().optional(),
    glow: z.string().trim().optional(),
    emoji: z.string().trim().optional(),
    image: z.string().trim().optional(),
    types: z.array(z.string()).optional(),
    vendorCode: z.enum(VENDOR_CODE_VALUES as [string, ...string[]]).optional(),
    sortOrder: z.number().int().min(0).optional(),
    game_name: z.string().trim().optional(),
    game_type: gameTypeSchema.optional(),
    game_image: z.string().trim().optional(),
    platform: z.string().trim().optional(),
    provider: z.string().trim().optional(),
  }),
});

export const updateGameValidation = z.object({
  body: createGameValidation.shape.body.partial(),
});
