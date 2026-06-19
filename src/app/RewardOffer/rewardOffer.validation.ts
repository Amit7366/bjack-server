import { z } from 'zod';
import { REWARD_OFFER_COOLDOWN_OPTIONS, REWARD_OFFER_CRITERIA_TYPES } from './rewardOffer.constants';

const localizedTextSchema = z.object({
  en: z.string().trim().min(1).max(200),
  bn: z.string().trim().min(1).max(200),
  hi: z.string().trim().min(1).max(200),
});

const offerBodySchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens'),
  title: localizedTextSchema,
  description: localizedTextSchema,
  bonusAmount: z.number().min(0),
  turnoverMultiplier: z.number().min(0).optional(),
  cooldownHours: z
    .number()
    .int()
    .refine((v) => (REWARD_OFFER_COOLDOWN_OPTIONS as readonly number[]).includes(v), {
      message: 'Cooldown must be 24, 72, 168, or 360 hours',
    }),
  criteriaType: z.enum(REWARD_OFFER_CRITERIA_TYPES),
  criteriaValue: z.number().min(0).optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
  isActive: z.boolean().optional(),
});

export const createRewardOfferSchema = z.object({
  body: offerBodySchema.superRefine((data, ctx) => {
    if (data.criteriaType !== 'none' && (data.criteriaValue ?? 0) <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'criteriaValue is required when criteriaType is not none',
        path: ['criteriaValue'],
      });
    }
  }),
});

export const updateRewardOfferSchema = z.object({
  body: offerBodySchema
    .partial()
    .omit({ slug: true })
    .extend({ slug: offerBodySchema.shape.slug.optional() })
    .superRefine((data, ctx) => {
      if (data.criteriaType && data.criteriaType !== 'none' && (data.criteriaValue ?? 0) <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'criteriaValue is required when criteriaType is not none',
          path: ['criteriaValue'],
        });
      }
    }),
});
