import httpStatus from 'http-status';
// import catchAsync from '../../utilis/catchAsync';
// import sendResponse from '../../utilis/sendResponse';
import { AuthServices } from './auth.services';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import config from '../config';
import AppError from '../errors/AppError';
import { UserBalance } from '../Transaction/userBalance.model';

export const loginUser = catchAsync(async (req, res) => {
  try {
    const loginPayload = {
      ...req.body,
      ip: req.body?.ip || req.ip,
    };
    const result = await AuthServices.loginUser(loginPayload);
    const { refreshToken, accessToken, needsPasswordChange, memberId, status } = result;

    let initialBal = 0;

    if (memberId) {
      // 🔹 Directly get from MongoDB (removed Redis + seeding)
      const doc = await UserBalance.findOne(
        { id: memberId },
        { currentBalance: 1, _id: 0 }
      ).lean();
      initialBal = Number(doc?.currentBalance ?? 0);
    }

    // 🔹 Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      secure: config.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    // 🔹 Send success response with Mongo balance only
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User is logged in successfully!',
      data: {
        accessToken,
        needsPasswordChange,
        memberId: memberId || undefined,
        balance: Number(initialBal).toFixed(2),
        status: status || 'active',
      },
    });
  } catch (err: any) {
    const status = err?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = err?.message || 'Something went wrong';
    return sendResponse(res, {
      statusCode: status,
      success: false,
      message,
      data: null,
    });
  }
});

const changePassword = catchAsync(async (req, res) => {
  console.log(req.user, req.body);
  if (!req.user) {
    // Optional: return error or throw
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }
  const { ...passwordData } = req.body;

  const result = await AuthServices.changePassword(req.user, passwordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is updated successfully!',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});

const logoutUser = catchAsync(async (_req, res) => {
  res.clearCookie('refreshToken', {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged out successfully!',
    data: null,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  console.log("controller", email);

  // Validate email format
  if (!email || typeof email !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  try {
    // Call the forgetPassword service function
    const result = await AuthServices.forgetPassword(email);

    // If everything is fine, return a success response
    return res.status(200).json({
      success: true,
      message: "A password reset link has been sent to your email. Please check your inbox (and spam folder) for further instructions.",
      data: result, // This could be the reset link or any data from the service
    });
  } catch (error: any) {
    // Handle known errors (User not found, User blocked, User deleted)
    if (error?.status === httpStatus.NOT_FOUND) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: error.message, // "User not found"
        errorSources: [
          {
            path: "email",
            message: "User not found", // Specific error for email
          },
        ],
      });
    }

    if (error?.status === httpStatus.FORBIDDEN) {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: error.message, // Could be "User is blocked" or "User is deleted"
        errorSources: [
          {
            path: "email",
            message: error.message, // Specific error for email
          },
        ],
      });
    }

    // For other types of errors, send a generic 500 response
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An unexpected error occurred. Please try again.",
      errorSources: [
        {
          path: "server",
          message: error.message, // General error message
        },
      ],
    });
  }
});


const resetPassword = catchAsync(async (req, res) => {
  // const token = req.headers.authorization;
  const { token } = req.query;
  //  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ3MzczIiwicm9sZSI6InVzZXIiLCJlbWFpbCI6InRpbWV0cmF2ZWxsZXIwMzg4QGdtYWlsLmNvbSIsIm9iamVjdElkIjoiNjcwYTU0YTAxYzVhZjAyODEyMWU4YWFjIiwiaWF0IjoxNzMxNjcyODMwLCJleHAiOjE3MzE2NzM0MzB9.twzP-XX-x9TpXDQmyNjyt7oOBcayVj6Ugzsjcl3A5Gg';

  if (!token || typeof token !== 'string') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Token is missing or invalid!');
  }
  const result = await AuthServices.resetPassword(req.body, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successfully!',
    data: result,
  });
});

const sendForgetOtp = catchAsync(async (req, res) => {
  const { contactNo } = req.body;

  const result = await AuthServices.sendForgetOtp(contactNo);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const verifyForgetOtp = catchAsync(async (req, res) => {
  const { contactNo, otp } = req.body;

  const result = await AuthServices.verifyForgetOtp(contactNo, otp);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const resetPasswordWithOtp = catchAsync(
  async (req, res) => {
    const { contactNo, newPassword } = req.body;

    const result = await AuthServices.resetPasswordWithOtp(
      contactNo,
      newPassword
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: null,
    });
  }
);
export const AuthController = {
  loginUser,
  logoutUser,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
  sendForgetOtp,
  verifyForgetOtp,
  resetPasswordWithOtp,
};
