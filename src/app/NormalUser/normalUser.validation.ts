import { z } from 'zod';
import { BloodGroup, Gender } from './normalUser.constant';

// Helper: convert "" -> undefined for optional string fields
const emptyToUndefined = z.preprocess((v) => {
  if (typeof v === 'string' && v.trim() === '') return undefined;
  return v;
}, z.any());

export const createNormalUserValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    normalUser: z.object({
      name: z.string().min(1).max(40),
      userName: z.string().min(1).max(40),

      customerOfficerId: emptyToUndefined.pipe(z.string()).optional(),
      engagementStatus: emptyToUndefined.pipe(z.enum(['booked', 'free', 'blocked'])).optional(),

      contactNo: z.string().min(1).max(15),

      referralId: emptyToUndefined.pipe(z.string()).optional(),
      referredBy: emptyToUndefined.pipe(z.string()).optional(),
      refferCount: emptyToUndefined.pipe(z.string()).optional(),

      // Accept "23" as 23 from mobile
      age: z.coerce.number().optional(),

      _referrerUserId: emptyToUndefined.pipe(z.string()).optional(),
      designation: emptyToUndefined.pipe(z.string().max(30)).optional(),
      gender: emptyToUndefined.pipe(z.enum([...Gender] as [string, ...string[]])).optional(),
      dateOfBirth: emptyToUndefined.pipe(z.string()).optional(),
      email: emptyToUndefined.pipe(z.string().email()).optional(),
      ip: emptyToUndefined.pipe(z.string()).optional(),
      device: emptyToUndefined.pipe(z.string()).optional(),
      // If provided, must be non-empty; empty string becomes undefined (not an error)
      deviceFingerprint: emptyToUndefined.pipe(z.string().min(1)).optional(),
      country: emptyToUndefined.pipe(z.string()).optional(),
      emergencyContactNo: emptyToUndefined.pipe(z.string()).optional(),
      bloodGroup: emptyToUndefined.pipe(z.enum([...BloodGroup] as [string, ...string[]])).optional(),
      state: emptyToUndefined.pipe(z.string()).optional(),
      city: emptyToUndefined.pipe(z.string()).optional(),
      postalCode: emptyToUndefined.pipe(z.string()).optional(),
      presentAddress: emptyToUndefined.pipe(z.string()).optional(),
      permanentAddress: emptyToUndefined.pipe(z.string()).optional(),

      profileImg: emptyToUndefined.pipe(z.string()).optional(),

      userLevel: z.object({
        type: emptyToUndefined.pipe(z.string()).optional(),
        enum: emptyToUndefined.pipe(z.enum(['Normal', 'Bronze', 'Silver', 'Gold', 'Platinum'])).optional(),
        default: z.literal('Normal').optional(),
      }).optional(),

      isDeleted: z.boolean().default(false).optional(),
      role: z.enum(['superAdmin', 'admin', 'user', 'advertiser']).default('user').optional(),
      needsPasswordChange: z.boolean().default(true).optional(),
      userPlainPassword: emptyToUndefined.pipe(z.string()).optional(),
      passwordChangeAt: emptyToUndefined.pipe(z.string()).optional(),
      lastActiveAt: emptyToUndefined.pipe(z.string()).optional(),
      isVerified: z.boolean().default(false).optional(),
      kycDocumentFrontUrl: emptyToUndefined.pipe(z.string()).optional(),
      kycDocumentBackUrl: emptyToUndefined.pipe(z.string()).optional(),
      kycSelfieUrl: emptyToUndefined.pipe(z.string()).optional(),
      kycVerified: z.boolean().default(false).optional(),
      status: emptyToUndefined.pipe(z.enum(['active', 'frozen', 'deactivated', 'pending'])).default('active').optional(),
      signupBonusGiven: z.boolean().default(false).optional(),

      // passthrough (optional) identifiers
      id: emptyToUndefined.pipe(z.string()).optional(),
      user: emptyToUndefined.pipe(z.string()).optional(),
      _id: emptyToUndefined.pipe(z.string()).optional(),
    }).superRefine((data, ctx) => {
      const referredBy = typeof data.referredBy === 'string' ? data.referredBy.trim() : '';
      const hasReferral = referredBy.length > 0 && referredBy !== 'self';
      const fingerprint =
        typeof data.deviceFingerprint === 'string' ? data.deviceFingerprint.trim() : '';

      if (hasReferral && !fingerprint) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Device verification is required when registering with a referral code.',
          path: ['deviceFingerprint'],
        });
      }
    }),
  }),
});

export const updateNormalUserValidationSchema = z.object({
  body: z.object({
    normalUser: z.object({
      name: emptyToUndefined.pipe(z.string().min(3).max(40)).optional(),
      userName: emptyToUndefined.pipe(z.string()).optional(),
      ip: emptyToUndefined.pipe(z.string()).optional(),
      country: emptyToUndefined.pipe(z.string()).optional(),
      device: emptyToUndefined.pipe(z.string()).optional(),
      deviceFingerprint: emptyToUndefined.pipe(z.string()).optional(),
      profileImg: emptyToUndefined.pipe(z.string()).optional(),
      customerOfficerId: emptyToUndefined.pipe(z.string()).optional(),
      engagementStatus: emptyToUndefined.pipe(z.enum(['booked', 'free', 'blocked'])).optional(),

      // Accept numeric strings here too
      age: z.coerce.number().optional(),

      contactNo: emptyToUndefined.pipe(z.string()).optional(),
      referralId: emptyToUndefined.pipe(z.string()).optional(),
      referredBy: emptyToUndefined.pipe(z.string()).optional(),
      _referrerUserId: emptyToUndefined.pipe(z.string()).optional(),
      refferCount: emptyToUndefined.pipe(z.string()).optional(),
      designation: emptyToUndefined.pipe(z.string().max(30)).optional(),
      gender: emptyToUndefined.pipe(z.enum([...Gender] as [string, ...string[]])).optional(),
      dateOfBirth: emptyToUndefined.pipe(z.string()).optional(),
      email: emptyToUndefined.pipe(z.string().email()).optional(),
      emergencyContactNo: emptyToUndefined.pipe(z.string()).optional(),
      bloodGroup: emptyToUndefined.pipe(z.enum([...BloodGroup] as [string, ...string[]])).optional(),
      state: emptyToUndefined.pipe(z.string()).optional(),
      city: emptyToUndefined.pipe(z.string()).optional(),
      postalCode: emptyToUndefined.pipe(z.string()).optional(),
      presentAddress: emptyToUndefined.pipe(z.string()).optional(),
      permanentAddress: emptyToUndefined.pipe(z.string()).optional(),

      userLevel: z.object({
        type: emptyToUndefined.pipe(z.string()).optional(),
        enum: emptyToUndefined.pipe(z.enum(['Normal', 'Bronze', 'Silver', 'Gold', 'Platinum'])).optional(),
        default: z.literal('Normal').optional(),
      }).optional(),

      isDeleted: z.boolean().default(false).optional(),
      role: z.enum(['superAdmin', 'admin', 'user', 'advertiser']).default('user').optional(),
      needsPasswordChange: z.boolean().default(true).optional(),
      passwordChangeAt: emptyToUndefined.pipe(z.string()).optional(),
      lastActiveAt: emptyToUndefined.pipe(z.string()).optional(),
      isVerified: z.boolean().default(false).optional(),
      kycDocumentUrl: emptyToUndefined.pipe(z.string()).optional(),
      kycVerified: z.boolean().default(false).optional(),
      status: emptyToUndefined.pipe(z.enum(['active', 'frozen', 'deactivated', 'pending'])).default('active').optional(),
      signupBonusGiven: z.boolean().default(false).optional(),

      // passthrough (optional) identifiers
      id: emptyToUndefined.pipe(z.string()).optional(),
      user: emptyToUndefined.pipe(z.string()).optional(),
      _id: emptyToUndefined.pipe(z.string()).optional(),
    }),
  }),
});

export const NormalUserValidations = {
  createNormalUserValidationSchema,
  updateNormalUserValidationSchema,
};
