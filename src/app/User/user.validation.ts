import { z } from 'zod';
import { UserStatus } from './user.constant';

// Helper: convert "" -> undefined for optional string fields
const emptyToUndefined = z.preprocess((v) => {
  if (typeof v === 'string' && v.trim() === '') return undefined;
  return v;
}, z.any());

const userValidationSchema = z.object({
  body: z.object({
    password: z
      .string({ invalid_type_error: 'Password must be string' })
      .max(20, { message: 'Password can not be more than 20 characters' })
      .optional(),

    referralId: emptyToUndefined.pipe(z.string()).optional(),
    referredBy: emptyToUndefined.pipe(z.string()).optional(),
    refferCount: emptyToUndefined.pipe(z.string()).optional(),
    country: emptyToUndefined.pipe(z.string()).optional(),
    contactNo: emptyToUndefined.pipe(z.string()).optional(),
    userName: emptyToUndefined.pipe(z.string()).optional(),
    email: emptyToUndefined.pipe(z.string().email()).optional(),
    customerOfficerId: emptyToUndefined.pipe(z.string()).optional(),
    engagementStatus: emptyToUndefined.pipe(z.enum(['booked', 'free', 'blocked'])).optional(),

    // Accept numeric strings
    age: z.coerce.number().optional(),

    device: emptyToUndefined.pipe(z.string()).optional(),
    deviceFingerprint: emptyToUndefined.pipe(z.string()).optional(),
    name: emptyToUndefined.pipe(z.string()).optional(),
    profileImg: emptyToUndefined.pipe(z.string()).optional(),
    userLevel: emptyToUndefined.pipe(z.enum(['Normal', 'Bronze', 'Silver', 'Gold', 'Platinum'])).optional(),
    id: emptyToUndefined.pipe(z.string()).optional(),
    gender: emptyToUndefined.pipe(z.enum(['male', 'female', 'other'])).optional(),
    isVerified: z.boolean().optional(),
    isDeleted: z.boolean().default(false).optional(),
    needsPasswordChange: z.boolean().default(true).optional(),
    userPlainPassword: emptyToUndefined.pipe(z.string()).optional(),
    passwordChangeAt: emptyToUndefined.pipe(z.string()).optional(),
    role: z.enum(['superAdmin', 'admin', 'user', 'advertiser']).default('user').optional(),
    dateOfBirth: emptyToUndefined.pipe(z.string()).optional(),
    lastActiveAt: emptyToUndefined.pipe(z.string()).optional(),
    kycDocumentFrontUrl: emptyToUndefined.pipe(z.string()).optional(),
    kycDocumentBackUrl: emptyToUndefined.pipe(z.string()).optional(),
    kycSelfieUrl: emptyToUndefined.pipe(z.string()).optional(),
    kycVerified: z.boolean().default(false).optional(),
    status: emptyToUndefined.pipe(z.enum([...UserStatus] as [string, ...string[]])).default('active').optional(),
    signupBonusGiven: z.boolean().default(false).optional(),
    emergencyContactNo: emptyToUndefined.pipe(z.string()).optional(),
    state: emptyToUndefined.pipe(z.string()).optional(),
    city: emptyToUndefined.pipe(z.string()).optional(),
    postalCode: emptyToUndefined.pipe(z.string()).optional(),
    presentAddress: emptyToUndefined.pipe(z.string()).optional(),
  }),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});

const deviceRegistrationStatusValidationSchema = z.object({
  body: z.object({
    deviceFingerprint: z.string().min(1, 'Device verification is required.'),
  }),
});

export const UserValidation = {
  userValidationSchema,
  changeStatusValidationSchema,
  deviceRegistrationStatusValidationSchema,
};
