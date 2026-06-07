import { z } from 'zod';

export const createGameValidation = z.object({
  body: z.object({
    tileId: z.string(),
    title: z.string(),
    providerKey: z.string().optional(),
    providerLabel: z.string().optional(),
    gameCode: z.string().optional(),
    gradient: z.string().optional(),
    glow: z.string().optional(),
    emoji: z.string().optional(),
    image: z.string().url(),
    types: z.array(z.string()).optional(),
    vendorCode: z.string().optional(),
    sortOrder: z.number().optional(),
    game_name: z.string().optional(),
    game_type: z.string().optional(),
    game_image: z.string().url().optional(),
    platform: z.string().optional(),
    provider: z.string().optional(),
  }),
});

export const updateGameValidation = z.object({
  body: z.object({
    tileId: z.string().optional(),
    title: z.string().optional(),
    providerKey: z.string().optional(),
    providerLabel: z.string().optional(),
    gameCode: z.string().optional(),
    gradient: z.string().optional(),
    glow: z.string().optional(),
    emoji: z.string().optional(),
    image: z.string().url().optional(),
    types: z.array(z.string()).optional(),
    vendorCode: z.string().optional(),
    sortOrder: z.number().optional(),
    game_name: z.string().optional(),
    game_type: z.string().optional(),
    game_image: z.string().url().optional(),
    platform: z.string().optional(),
    provider: z.string().optional(),
  }),
});
