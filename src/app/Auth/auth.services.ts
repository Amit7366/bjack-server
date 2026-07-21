import httpStatus from 'http-status';

import { TLoginUser } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';

// import config from '../../config';
import bcrypt from 'bcrypt';
import AppError from '../errors/AppError';
import config from '../config';
import { createToken, verifyToken } from './auth.utils';
import { sendEmail } from '../utilis/sendEmail';
import { User } from '../User/user.model';
import { sendOtpSms } from '../User/sendSms';
import { generateOtp } from '../User/generateOtp';
import { recordUserDevice } from '../Referral/referralDeviceGuard';

export const loginUser = async (payload: TLoginUser) => {
  const { userName, contactNo, email, password, deviceFingerprint, ip } = payload;

  if ((!userName && !contactNo && !email) || !password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'userName or contactNo or email and password are required'
    );
  }

  // Always make sure we get password
  // Prefer a single consistent query shape across branches
  let user =
    (userName &&
      (await User.findOne({ userName }).select('+password').lean())) ||
    (contactNo &&
      (await User.findOne({ contactNo }).select('+password').lean())) ||
    (email &&
      (await User.findOne({ email }).select('+password').lean())) ||
    null;

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Safety on _id/id usage
  const objectId = String(user._id || '');
  if (!objectId) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'User ID is not defined');
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  if (user.status === 'deactivated') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  // Partners (advertisers) cannot log in unless fully active
  if (user.role === 'advertiser' && user.status !== 'active') {
    throw new AppError(httpStatus.FORBIDDEN, 'Partner account is paused');
  }

  // password must be present because we selected it above
  const isPasswordMatched = await User.isPasswordMatched(password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not match');
  }

  // If you use a separate human-readable "memberId", map it here.
  // If not, using objectId as memberId is OK.
  const id = user.id || String(user._id);

  const jwtPayload = {
    id,
    role: user.role || 'user',
    email: user.email || '',
    contactNo: user.contactNo || '',
    userName: user.userName || '',
    objectId,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  // Non-blocking: this is a tiny write, but keep it awaited for correctness
  await User.findByIdAndUpdate(objectId, { lastActiveAt: new Date() }).lean();

  if (deviceFingerprint?.trim()) {
    try {
      await recordUserDevice({
        userId: objectId,
        deviceFingerprint,
        ip,
      });
    } catch (err) {
      console.warn('Failed to record login device fingerprint:', err);
    }
  }

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: !!user.needsPasswordChange,
    memberId: id,
    status: (user.status as string) || 'active',
  };
};



const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exist
  console.log(userData);
  const user = await User.isUserExistsByCustomId(userData.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === 'deactivated') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  // Ensure id is defined before using it
  const id = user.id;
  if (!id) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'User ID is not defined',
    );
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findOneAndUpdate(
    {
      id: id, // Ensure id is used here
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};
// const refreshToken = async (token: string) => {
//   // const user = await User.isUserExistsByCustomId(payload.id);
//   // console.log('from login',user)
//   // const userObjectId = user?._id;
//   try {
//     // Checking if the given token is valid
//     const decoded = verifyToken(token, config.jwt_refresh_secret as string);

//     // Extracting id from the decoded token
//     const { id } = decoded;
//     console.log(id)
//     // const id = decoded.id as string;
//     const email = decoded.email as string;
//     // Checking if the user exists
//     const user = await User.isUserExistsByCustomId(id);
//     // const user = await User.isUserExistsByEmail(email);
//     console.log(user)
//     if (!user) {
//       throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//     }

//     // Checking if the user is deleted
//     if (user.isDeleted) {
//       throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
//     }

//     // Checking if the user is blocked
//     if (user.status === 'inactive') {
//       throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
//     }

//     // Creating a new access token
//     const jwtPayload = {
//       id: id,
//       role: user.role,
//       email: user.email,
//       // objectId: userObjectId.toHexString(),
//       objectId: user?._id,
//     };

//     const accessToken = createToken(
//       jwtPayload,
//       config.jwt_access_secret as string,
//       config.jwt_access_expires_in as string,
//     );

//     return {
//       accessToken,
//     };
//   } catch (error) {
//     if (error instanceof AppError) {
//       throw error;
//     } else {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Invalid token');
//     }
//   }
// };

const refreshToken = async (token: string) => {
  try {
    // Checking if the given token is valid
    const decoded = verifyToken(token, config.jwt_refresh_secret as string);

    // Extracting id and email from the decoded token
    const { id, email, contactNo } = decoded;
    console.log('Decoded ID:', id);
    console.log('Decoded Email:', email);

    // Check user existence by custom ID
    const userById = await User.isUserExistsByCustomId(contactNo);
    console.log('User fetched by ID:', userById);

    // Check user existence by email if not found by ID
    let user = userById;
    if (!user) {
      user = await User.isUserExistsByEmail(email);
      console.log('User fetched by Email:', user);
    }

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Checking if the user is deleted
    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
    }

    // Checking if the user is blocked
    if (user.status === 'deactivated') {
      throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
    }

    if (user.role === 'advertiser' && user.status !== 'active') {
      throw new AppError(httpStatus.FORBIDDEN, 'Partner account is paused');
    }

    // Creating a new access token
    const jwtPayload = {
      // id: user.id,
      id: user.id || '',
      role: user.role || '',
      email: user.email || '',
      contactNo: user.contactNo || '',
      userName: user.userName || '',
      objectId: user?._id.toHexString() || '',
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    return {
      accessToken,
    };
  } catch (error) {
    console.error('Error during token refresh:', error);
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid token');
    }
  }
};
const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(payload?.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'deactivated') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  //localhost:3000?id=A-0001&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDI4NTA2MTcsImV4cCI6MTcwMjg1MTIxN30.-T90nRaz8-KouKki1DkCSMAbsHyb9yDi0djZU3D6QO4

  if (payload.email !== decoded.email) {
    console.log(payload.email, decoded.email);
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  const updatedUser = await User.findOneAndUpdate(
    { email: decoded.email },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true, projection: { password: 0, __v: 0 } } // exclude password and other sensitive fields
  );

  return updatedUser;
};
const forgetPassword = async (email: string) => {
  try {
    // checking if the user exists
    console.log(email)
    const user = await User.isUserExistsByEmail(email);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // checking if the user is deleted
    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
    }

    // checking if the user is blocked
    if (user.status === 'deactivated') {
      throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
    }

    // Ensure id is always a string, handle undefined case
    const jwtPayload = {
      id: user?.id || '', // Use optional chaining and provide a default value
      role: user.role || '',
      email: user.email || '',

      contactNo: user.contactNo || '',
      userName: user.userName || '',
      // objectId: userObjectId.toHexString(),
      objectId: user?._id || '',
    };

    // creating a reset token
    const resetToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      '10m', // assuming the expiration time is 10 minutes
    );

    // constructing the reset password UI link
    const resetUILink = `${config.reset_pass_ui_link}?email=${user.email}&token=${resetToken}`;

    // sending the reset link via email
    // await sendEmail(user.email, resetUILink);
    // console.log(user.email, resetUILink); // logging the reset link (optional)

    return resetUILink; // returning null as there's no meaningful data to return
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
      );
    }
  }
};
const sendForgetOtp = async (contactNo: string) => {
  const user = await User.isUserExistsByContactNo(contactNo) as any;
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
  }

  const now = new Date();

  // Rate limit: new OTP can only be sent after 2 minutes
  if (user.otpExpiresAt && now.getTime() < user.otpExpiresAt.getTime() - 8 * 60 * 1000) {
    // 8 minutes left because expiry is 10 min, so 2 min must pass before next OTP
    throw new AppError(
      httpStatus.TOO_MANY_REQUESTS,
      'Please wait 2 minutes before requesting a new OTP'
    );
  }

  const otp = generateOtp();

  const expiry = new Date(now.getTime() + 10 * 60 * 1000); // 10 min

  user.otpCode = otp;
  user.otpExpiresAt = expiry;
  user.otpVerified = false;

  await user.save();

  await sendOtpSms(contactNo, otp);

  return {
    success: true,
    message: 'OTP sent successfully',
  };
};


const verifyForgetOtp = async (contactNo: string, otp: string) => {
  const user = await User.isUserExistsByContactNo(contactNo) as any;


  if (!user || !user.otpCode) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid request');
  }

  if (user.otpCode !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid OTP');
  }

  if (new Date() > user.otpExpiresAt!) {
    throw new AppError(httpStatus.BAD_REQUEST, 'OTP expired');
  }

  user.otpVerified = true;
  await user.save();

  return {
    success: true,
    message: 'OTP verified successfully',
  };
};

const resetPasswordWithOtp = async (
  contactNo: string,
  newPassword: string
) => {
  const user = await User.isUserExistsByContactNo(contactNo) as any;


  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!user.otpVerified) {
    throw new AppError(httpStatus.FORBIDDEN, 'OTP not verified');
  }
  user.password = newPassword;
  user.passwordChangeAt = new Date();


  // Clear OTP
  user.otpCode = undefined;
  user.otpExpiresAt = undefined;
  user.otpVerified = false;

  await user.save();

  return {
    success: true,
    message: 'Password reset successful',
  };
};

export const AuthServices = {
  loginUser,
  refreshToken,
  // changePasswordUser,
  changePassword,
  forgetPassword,
  resetPassword,
  sendForgetOtp,
  verifyForgetOtp,
  resetPasswordWithOtp,
};
