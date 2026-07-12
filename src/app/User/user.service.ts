/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';
import { Admin } from '../Admin/admin.model';
import { TAdmin } from '../Admin/admin.interface';
import config from '../config';
import mongoose from 'mongoose';
import {
  generateAdminId,
  generateid,
} from './user.utils';
import { sendImageToCloudinary } from '../utilis/sendImageToCloudinary';
import { NormalUser } from '../NormalUser/normalUser.model';
import { TNormalUser } from '../NormalUser/normalUser.interface';
import { UserBalance } from '../Transaction/userBalance.model';
import { trackReferral } from '../Referral/referral.service';
import {
  assertDeviceAccountLimit,
  assertNotSelfReferralOnDevice,
  DEVICE_ACCOUNT_LIMIT_MESSAGE,
  getDeviceRegistrationStatus,
  recordUserDevice,
  SELF_REFERRAL_DEVICE_MESSAGE,
} from '../Referral/referralDeviceGuard';



export const createUserIntoDb = async (
  file: any,
  password: string,
  payload: TNormalUser
) => {
  const userData: Partial<TUser> = {
    password: password || 'defaultPassword',
    role: 'user',
    isDeleted: false,
    email: payload.email,
    contactNo: payload.contactNo,
    userName: payload.userName,
    isVerified: false,
  };

  const session = await mongoose.startSession();
  let retries = 3;

  while (retries > 0) {
    const session = await mongoose.startSession(); // start a fresh session per attempt
    try {
      await session.withTransaction(async () => {
        if (!payload.deviceFingerprint?.trim()) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'Device verification is required to register.',
          );
        }

        await assertDeviceAccountLimit(payload.deviceFingerprint);

        userData.id = await generateid(session); // use same session

        userData.referralId = userData.id;
        payload.referralId = userData.referralId;

        let referrerUserId: string | null = null;

        if (payload.referredBy && payload.referredBy !== 'self') {
          if (!payload.deviceFingerprint?.trim()) {
            throw new AppError(
              httpStatus.BAD_REQUEST,
              'Device verification is required when registering with a referral code.',
            );
          }

          await assertNotSelfReferralOnDevice({
            referredBy: payload.referredBy,
            deviceFingerprint: payload.deviceFingerprint,
          });

          const referrer = await User.findOne({
            referralId: {
              $regex: new RegExp(
                `^${payload.referredBy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
                'i',
              ),
            },
          }).session(session);
          if (referrer) {
            await User.updateOne({ _id: referrer._id }, { $inc: { refferCount: 1 } }, { session });
            await NormalUser.updateOne({ user: referrer._id }, { $inc: { refferCount: 1 } }, { session });
            // Store canonical referral code from referrer so referredBy always matches User.referralId
            payload.referredBy = referrer.referralId ?? payload.referredBy;
            referrerUserId = referrer._id.toString();
          } else {
            payload.referredBy = 'self';
          }
        } else {
          payload.referredBy = 'self';
        }

        userData.referredBy = payload.referredBy;

        const [newUser] = await User.create([userData], { session });
        if (!newUser) throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create User');

        payload.id = newUser.id;
        payload.user = newUser._id;
        payload.refferCount = 0;

        const [newNormalUser] = await NormalUser.create([payload], { session });
        if (!newNormalUser) throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create NormalUser');

        await recordUserDevice({
          userId: newUser._id,
          deviceFingerprint: payload.deviceFingerprint,
          ip: payload.ip,
          session,
        });

        // ✅ Create balance record (0 TK initially)
        await UserBalance.create([{
          userId: newUser._id,
          id: newUser.id,
          currentBalance: 0,
          storeDbBalance: 0,
          totalDeposit: 0,
          totalWithdraw: 0,
          currentCoinBalance: 300,
          totalCoinDeposit: 300,
          totalCoinWithdraw: 0,
        }], { session });

        if (referrerUserId) {
          await trackReferral(newUser._id.toString(), referrerUserId, session);
        }
      });

      // success
      return payload;

    } catch (err: any) {
      retries--;

      // Retry transient txn errors
      if (err?.errorLabels?.includes('TransientTransactionError') && retries > 0) {
        console.warn('Transient error, retrying transaction...');
        continue;
      }

      if (err instanceof AppError) {
        throw err;
      }

      // Handle duplicate keys
      if (err?.code === 11000) {
        if (err.keyPattern?.userName) throw new AppError(httpStatus.CONFLICT, 'Username already exists');
        if (err.keyPattern?.contactNo) throw new AppError(httpStatus.CONFLICT, 'Phone number already exists');
        // 🔁 NEW: retry on duplicate id/referralId (regen next attempt)
        if ((err.keyPattern?.id || err.keyPattern?.referralId) && retries > 0) {
          console.warn('Duplicate id/referralId, regenerating and retrying...');
          continue;
        }
        // (optional) email duplicate if you enforce unique email
        if (err.keyPattern?.email) throw new AppError(httpStatus.CONFLICT, 'Email already exists');
      }

      if (
        err?.message?.includes('device') ||
        err?.message === SELF_REFERRAL_DEVICE_MESSAGE ||
        err?.message === DEVICE_ACCOUNT_LIMIT_MESSAGE
      ) {
        throw new AppError(httpStatus.CONFLICT, err.message);
      }

      console.error('Unexpected error:', err);
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Unexpected error during user creation');

    } finally {
      // ALWAYS end this attempt's session
      try { await session.endSession(); } catch { }
    }
  }

};


const findByEmailIntoDb = async (email: string) => {
  const user = await User.findOne({ email }).populate({
    path: 'user',
    options: { strictPopulate: false },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

const createAdminIntoDB = async (
  file: any,
  password: string,
  payload: TAdmin,
) => {
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_password as string);
  userData.role = 'admin';
  userData.email = payload.email;
  userData.contactNo = payload.contactNo;
  userData.userName = payload.userName;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    userData.id = await generateAdminId();

    // ✅ Fix: Assign a dummy unique referralId to avoid null duplicates
    userData.referralId = `ADMIN-${userData.id}`;

    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};


const getMe = async (id: string, role: string) => {
  let result = null;
  console.log('from get me service', id, role);
  if (role === 'user') {
    // result = await User.findOne({ id: id }).populate('user');
    result = await User.findOne({ id: id }).populate({
      path: 'user',
      options: { strictPopulate: false },
    });
  }
  if (role === 'admin') {
    // result = await Admin.findOne({ id: id }).populate('user');
    result = await Admin.findOne({ id: id }).populate({
      path: 'user',
      options: { strictPopulate: false },
    });
  }

  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const getDeviceRegistrationStatusIntoDb = async (deviceFingerprint: string) => {
  return getDeviceRegistrationStatus(deviceFingerprint);
};

export const UserServices = {
  createUserIntoDb,
  createAdminIntoDB,
  getMe,
  changeStatus,
  findByEmailIntoDb,
  getDeviceRegistrationStatusIntoDb,
};
