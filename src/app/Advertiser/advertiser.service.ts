import httpStatus from 'http-status';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../config';
import AppError from '../errors/AppError';
import QueryBuilder from '../builder/QueryBuilder';
import { User } from '../User/user.model';
import { generateAdvertiserId } from '../User/user.utils';
import { AdminServices } from '../Admin/admin.service';
import { AdvertiserSearchableFields } from './advertiser.constant';
import { TAdvertiser } from './advertiser.interface';
import { Advertiser } from './advertiser.model';
import { PartnerCommissionService } from '../PartnerCommission/partnerCommission.service';
import { PartnerBalance } from '../PartnerCommission/partnerBalance.model';
import { getPartnerReferredUsersPage } from '../Referral/referral.service';
import type { PartnerReferredUsersQuery } from '../Referral/referral.service';

const getAllAdvertisersFromDB = async (query: Record<string, unknown>) => {
  const advertiserQuery = new QueryBuilder(
    Advertiser.find({ isDeleted: false })
      .populate({
        path: 'user',
        select: 'status role referralId',
        options: { strictPopulate: false },
      })
      .select(
        '_id id user name userName email contactNo partnerType commissionRate isDeleted createdAt updatedAt',
      ),
    query,
  )
    .search(AdvertiserSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await advertiserQuery.modelQuery;
  const meta = await advertiserQuery.countTotal();

  const userIds = result.map((r) => {
    const doc = r as { user?: { _id?: unknown } | unknown };
    const user = doc.user;
    if (user && typeof user === 'object' && '_id' in user) {
      return String((user as { _id: unknown })._id);
    }
    return String(user ?? '');
  }).filter(Boolean);

  const balances = userIds.length
    ? await PartnerBalance.find({ userId: { $in: userIds } }).lean()
    : [];
  const balanceByUserId = new Map(
    balances.map((b) => [String(b.userId), b]),
  );

  const enriched = result.map((r) => {
    const doc = r.toObject ? r.toObject() : r;
    const userId =
      doc.user && typeof doc.user === 'object' && '_id' in doc.user
        ? String(doc.user._id)
        : String(doc.user ?? '');
    const wallet = balanceByUserId.get(userId);
    return {
      ...doc,
      wallet: wallet
        ? {
            currentBalance: wallet.currentBalance,
            totalEarned: wallet.totalEarned,
            totalWithdrawn: wallet.totalWithdrawn,
          }
        : { currentBalance: 0, totalEarned: 0, totalWithdrawn: 0 },
    };
  });

  return { result: enriched, meta };
};

const getSingleAdvertiserFromDB = async (id: string) => {
  const result = await Advertiser.findById(id).populate({
    path: 'user',
    select: 'status role referralId',
    options: { strictPopulate: false },
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Partner not found');
  }
  return result;
};

const createAdvertiserIntoDB = async (
  password: string | undefined,
  payload: Omit<TAdvertiser, '_id' | 'id' | 'user' | 'isDeleted'>,
) => {
  const userData: Record<string, unknown> = {};
  userData.password = password || (config.default_password as string);
  userData.role = 'advertiser';
  userData.email = payload.email;
  userData.contactNo = payload.contactNo;
  userData.userName = payload.userName;
  userData.status = 'active';

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    userData.id = await generateAdvertiserId();
    userData.referralId = userData.id;

    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create partner user');
    }

    const advertiserPayload = {
      ...payload,
      id: newUser[0].id,
      user: newUser[0]._id,
    };

    const newAdvertiser = await Advertiser.create([advertiserPayload], { session });

    if (!newAdvertiser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create partner profile');
    }

    await PartnerCommissionService.initPartnerBalanceOnCreate(
      newUser[0]._id,
      newUser[0].id,
      session,
    );

    await session.commitTransaction();
    await session.endSession();

    return newAdvertiser[0];
  } catch (err: unknown) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

const updateAdvertiserIntoDB = async (
  id: string,
  payload: Partial<TAdvertiser> & { status?: string },
  password?: string,
) => {
  const existing = await Advertiser.findById(id);
  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, 'Partner not found');
  }

  const { status, ...advertiserFields } = payload;
  const { name, ...remainingAdvertiserData } = advertiserFields;
  const modifiedUpdatedData: Record<string, unknown> = { ...remainingAdvertiserData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const userUpdate: Record<string, unknown> = {};
  if (advertiserFields.email) userUpdate.email = advertiserFields.email;
  if (advertiserFields.contactNo) userUpdate.contactNo = advertiserFields.contactNo;
  if (advertiserFields.userName) userUpdate.userName = advertiserFields.userName;
  if (status) userUpdate.status = status;

  if (password) {
    userUpdate.password = await bcrypt.hash(
      password,
      Number(config.bcrypt_salt_round) || 10,
    );
    userUpdate.needsPasswordChange = false;
    userUpdate.passwordChangeAt = new Date();
  }

  if (Object.keys(userUpdate).length) {
    await User.findByIdAndUpdate(existing.user, userUpdate, {
      new: true,
      runValidators: true,
    });
  }

  const result = await Advertiser.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  }).populate({
    path: 'user',
    select: 'status role referralId',
    options: { strictPopulate: false },
  });

  return result;
};

const deleteAdvertiserFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedAdvertiser = await Advertiser.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedAdvertiser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete partner');
    }

    const userId = deletedAdvertiser.user;
    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { status: 'deactivated' },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to deactivate partner user');
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedAdvertiser;
  } catch (err: unknown) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

const getAdvertiserDashboardOverviewFromDB = async (
  userId: string,
  from?: string,
  to?: string,
) => {
  return AdminServices.getAdvertiserDashboardOverviewFromDB(userId, from, to);
};

const getMyReferredUsersFromDB = async (
  userId: string,
  query: PartnerReferredUsersQuery,
) => {
  return getPartnerReferredUsersPage(userId, query);
};

export const AdvertiserServices = {
  getAllAdvertisersFromDB,
  getSingleAdvertiserFromDB,
  createAdvertiserIntoDB,
  updateAdvertiserIntoDB,
  deleteAdvertiserFromDB,
  getAdvertiserDashboardOverviewFromDB,
  getMyReferredUsersFromDB,
};
