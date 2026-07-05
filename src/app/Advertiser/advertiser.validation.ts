import { z } from 'zod';
import { PartnerType } from './advertiser.constant';

const createUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20),
  lastName: z.string().min(1).max(20),
});

export const createAdvertiserValidationSchema = z.object({
  body: z.object({
    password: z.string().min(4).max(20).optional(),
    advertiser: z.object({
      name: createUserNameValidationSchema,
      userName: z.string().min(1).max(40),
      email: z.string().email(),
      contactNo: z.string().min(1),
      partnerType: z.enum([...PartnerType] as [string, ...string[]]),
    }),
  }),
});

const updateUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).optional(),
  lastName: z.string().min(1).max(20).optional(),
});

export const updateAdvertiserValidationSchema = z.object({
  body: z.object({
    password: z.string().min(4).max(20).optional(),
    advertiser: z.object({
      name: updateUserNameValidationSchema.optional(),
      userName: z.string().min(1).max(40).optional(),
      email: z.string().email().optional(),
      contactNo: z.string().min(1).optional(),
      partnerType: z.enum([...PartnerType] as [string, ...string[]]).optional(),
      commissionRate: z.number().min(0).max(1).nullable().optional(),
      status: z.enum(['active', 'frozen', 'deactivated', 'pending']).optional(),
    }),
  }),
});
