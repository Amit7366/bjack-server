import { z } from 'zod';
import { PASSWORD_RESET_STATUSES } from './passwordResetRequest.constant';

const passwordRules = z
  .string()
  .min(6)
  .max(20)
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[0-9]/, 'Password must contain a number')
  .regex(/^[A-Za-z0-9!@#$%*]+$/, 'Password contains invalid characters');

export const createPasswordResetRequestValidationSchema = z.object({
  body: z.object({
    userName: z.string().trim().min(1),
    contactNo: z.string().trim().min(1),
    newPassword: passwordRules,
  }),
});

export const listPasswordResetRequestsValidationSchema = z.object({
  query: z.object({
    status: z.enum(PASSWORD_RESET_STATUSES).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

export const rejectPasswordResetRequestValidationSchema = z.object({
  body: z
    .object({
      adminNote: z.string().trim().max(500).optional(),
    })
    .optional()
    .default({}),
});
