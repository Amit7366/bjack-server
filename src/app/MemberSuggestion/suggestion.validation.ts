import { z } from 'zod';
import {
  MAX_SUGGESTION_MESSAGE_LENGTH,
  SUGGESTION_CATEGORIES,
  SUGGESTION_STATUSES,
} from './suggestion.constant';

export const submitSuggestionValidationSchema = z.object({
  body: z.object({
    category: z.enum(SUGGESTION_CATEGORIES),
    message: z.string().trim().min(1).max(MAX_SUGGESTION_MESSAGE_LENGTH),
    captchaId: z.string().trim().min(1),
    captchaCode: z.string().trim().min(1).max(10),
  }),
});

export const listSuggestionsValidationSchema = z.object({
  query: z.object({
    status: z.enum(SUGGESTION_STATUSES).optional(),
    category: z.enum(SUGGESTION_CATEGORIES).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

export const updateSuggestionStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['reviewed']),
    adminNote: z.string().trim().max(500).optional(),
  }),
});
