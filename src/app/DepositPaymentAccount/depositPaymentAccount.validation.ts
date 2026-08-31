import { z } from 'zod';
import { PAYMENT_METHODS, PAYMENT_TYPES } from './depositPaymentAccount.constant';

const accountBody = z.object({
  paymentMethod: z.enum(PAYMENT_METHODS),
  paymentType: z.enum(PAYMENT_TYPES).optional(),
  channelId: z.string().trim().min(1).max(64),
  channelName: z.string().trim().min(1).max(120),
  accountNumber: z.string().trim().min(6).max(20),
  accountHolderName: z.string().trim().max(120).optional(),
  recommended: z.boolean().optional(),
  isEnabled: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(999).optional(),
});

export const createDepositPaymentAccountSchema = z.object({
  body: accountBody,
});

export const updateDepositPaymentAccountSchema = z.object({
  body: accountBody.partial(),
});
