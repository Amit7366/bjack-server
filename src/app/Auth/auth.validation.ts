import { z } from 'zod';

// const loginValidationSchema = z.object({
//   body:z.object({
//     username: z.string({
//       required_error: 'username is Required',
//     }),
//     password: z
//       .string({
//         required_error: 'Password is Required',
//       })
//       .min(8, { message: 'Password can not be less then 8 character' }),
//   })
// });
const emptyToUndefined = z.preprocess((v) => {
  if (typeof v === 'string' && v.trim() === '') return undefined;
  return v;
}, z.any());

const loginValidationSchema = z.object({
  body: z.object({
    id: emptyToUndefined.pipe(z.string()).optional(),
    email: emptyToUndefined.pipe(z.string().email()).optional(),
    contactNo: emptyToUndefined.pipe(z.string()).optional(),
    userName: emptyToUndefined.pipe(z.string()).optional(),
    // consider enforcing min length if you want:
    password: z.string({ required_error: 'Password is required' }),
    deviceFingerprint: emptyToUndefined.pipe(z.string().min(1)).optional(),
    ip: emptyToUndefined.pipe(z.string()).optional(),
  }).refine((b) => !!(b.id || b.email || b.contactNo || b.userName), {
    message: 'Provide id, email, userName or contactNo',
    path: ['body', 'identifier'],
  }),
});
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});
const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
    newPassword: z
      .string({ required_error: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(20, { message: 'Password must be at most 20 characters' }),
  }),
});
const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required!',
    }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'User id is required!',
    }),
    newPassword: z.string({
      required_error: 'User password is required!',
    }),
  }),
});

const sendForgetOtpValidation = z.object({
  body: z.object({
    contactNo: z.string(),
  }),
});

const verifyForgetOtpValidation = z.object({
  body: z.object({
    contactNo: z.string(),
    otp: z.string(),
  }),
});

const resetPasswordOtpValidation = z.object({
  body: z.object({
    contactNo: z.string(),
    newPassword: z.string().min(6),
  }),
});
export const AuthValidation = {
  loginValidationSchema,
  refreshTokenValidationSchema,
  changePasswordValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
  sendForgetOtpValidation,
  verifyForgetOtpValidation,
  resetPasswordOtpValidation,
};
