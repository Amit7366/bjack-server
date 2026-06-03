import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const commonQuery = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  type: z.enum(['win', 'lose', 'refund']).optional(),
  provider: z.string().min(1).optional(),
  game_type: z.string().min(1).optional(),
  from: z.string().min(1).optional(),
  to: z.string().min(1).optional(),
  status: z.enum(['pending', 'completed', 'failed']).optional(),
  search: z.string().min(1).optional(),
});

// USER: requires userId in query
export const userBetHistorySchema = z.object({
  query: commonQuery.extend({
    userId: z.string().regex(objectIdRegex, 'Invalid userId').optional(),
  }),
});

// ADMIN: optional userId filter
export const adminBetHistorySchema = z.object({
  query: commonQuery.extend({
    userId: z.string().regex(objectIdRegex, 'Invalid userId').optional(),
  }),
});
