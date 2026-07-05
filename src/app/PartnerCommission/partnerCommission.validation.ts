import { z } from 'zod';

export const updateCommissionSettingsSchema = z.object({
  body: z.object({
    defaultCommissionRate: z.number().min(0).max(1),
  }),
});

export const createPartnerWithdrawRequestSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    paymentMethod: z.enum(['bkash', 'nagad', 'rocket']),
    walletNumber: z.string().min(1),
    accountHolderName: z.string().min(1),
  }),
});

export const rejectPartnerWithdrawRequestSchema = z.object({
  body: z.object({
    adminNote: z.string().optional(),
  }),
});
