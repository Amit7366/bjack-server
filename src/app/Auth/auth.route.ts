import express from 'express';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { USER_ROLE } from '../User/user.constant';
import validateRequest from '../middleware/validateRequest';
import auth from '../middleware/auth';
const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser,
);

router.post('/logout', AuthController.logoutUser);

router.post(
  '/change-password',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.viewer,
    USER_ROLE.user,
    USER_ROLE.advertiser,
  ),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword,
);

router.post(
  '/refresh-token',
  auth(
    USER_ROLE.user,
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.viewer,
    USER_ROLE.advertiser,
  ),
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshToken,
);

router.post(
  '/forget-password',
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthController.forgetPassword,
);

router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthController.resetPassword,
);

// Send OTP
router.post(
  '/send-forget-otp',
  validateRequest(AuthValidation.sendForgetOtpValidation),
  AuthController.sendForgetOtp
);

// Verify OTP
router.post(
  '/verify-forget-otp',
  validateRequest(AuthValidation.verifyForgetOtpValidation),
  AuthController.verifyForgetOtp
);

// Reset Password
router.post(
  '/reset-password-otp',
  validateRequest(AuthValidation.resetPasswordOtpValidation),
  AuthController.resetPasswordWithOtp
);
export const AuthRoutes = router;
