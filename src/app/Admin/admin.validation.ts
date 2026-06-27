import { z } from 'zod';
import { BloodGroup, Gender } from './admin.constant';

const createUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20),
  middleName: z.string().max(20),
  lastName: z.string().max(20),
});

export const createAdminValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    admin: z.object({
      designation: z.string(),
      name: createUserNameValidationSchema,
      userName: z.string().min(1).max(40),
      gender: z.enum([...Gender] as [string, ...string[]]),
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      // profileImg: z.string(),
    }),
  }),
});

const updateUserNameValidationSchema = z.object({
  firstName: z.string().min(3).max(20).optional(),
  lastName: z.string().min(3).max(20).optional(),
});

export const updateAdminValidationSchema = z.object({
  body: z.object({
    admin: z.object({
      name: updateUserNameValidationSchema,
      designation: z.string().max(30).optional(),
      userName: z.string().optional(),
      gender: z.enum([...Gender] as [string, ...string[]]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]).optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      // profileImg: z.string().optional(),
    }),
  }),
});
 export const giveSignupBonusValidation = z.object({
  body: z.object({
    bonusAmount: z.number().min(1).max(10000, 'Max 10000 TK allowed'),
  }),
});
export const updateUserStatusValidation = z.object({
  body: z.object({
    status: z.enum(['active', 'frozen', 'deactivated', 'pending']),
  }),
});
export const assignCustomerOfficerValidation = z.object({
  body: z.object({
    officerId: z.string().min(1, 'officerId is required'),
  }),
});
export const giveDepositValidation = z.object({
  body: z.object({
    amount: z.number().min(1, 'Amount must be at least 1'),
    paymentMethod: z.enum(['bkash', 'nagad', 'rocket']).optional(),
    promoCode: z.string().trim().optional(),
  }),
});
export const giveWithdrawValidation = z.object({
  body: z
    .object({
      amount: z.number().min(1, 'Amount must be at least 1'),
      walletId: z.string().trim().optional(),
      paymentMethod: z.enum(['bkash', 'nagad', 'rocket']).optional(),
      walletNumber: z.string().trim().optional(),
      accountHolderName: z.string().trim().optional(),
    })
    .superRefine((body, ctx) => {
      if (body.walletId) return;

      if (!body.paymentMethod) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Payment method is required when wallet id is not provided',
          path: ['paymentMethod'],
        });
      }
      if (!body.walletNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Wallet number is required when wallet id is not provided',
          path: ['walletNumber'],
        });
      }
      if (!body.accountHolderName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Account holder name is required when wallet id is not provided',
          path: ['accountHolderName'],
        });
      }
    }),
});
export const AdminValidations = {
  createAdminValidationSchema,
  updateAdminValidationSchema,
  giveSignupBonusValidation,
  updateUserStatusValidation,
  giveDepositValidation,
  giveWithdrawValidation,
};
