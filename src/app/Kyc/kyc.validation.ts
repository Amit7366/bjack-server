import { z } from 'zod';
import { KYC_DOCUMENT_TYPES, KYC_STATUS } from './kyc.constant';

export const submitKycValidationSchema = z.object({
  body: z.object({
    documentType: z.enum(KYC_DOCUMENT_TYPES),
    documentNo: z.string().trim().min(1).max(80),
    documentExpiry: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use date format YYYY-MM-DD'),
  }),
});

export const updateKycStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['approved', 'rejected']),
    note: z.string().trim().max(500).optional(),
  }),
});

export const listKycSubmissionsValidationSchema = z.object({
  query: z.object({
    status: z.enum(KYC_STATUS).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});
