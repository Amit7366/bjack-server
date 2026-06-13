import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';

import AppError from '../errors/AppError';
import { User } from '../User/user.model';
import QueryBuilder from '../builder/QueryBuilder';
import { NormalUser } from './normalUser.model';
import { NormalUserSearchableFields } from './normalUser.constant';
import { TNormalUser } from './normalUser.interface';
import { UserBalance } from '../Transaction/userBalance.model';
import { UserPromotion } from '../UserPromotion/userPromotion.model';

export const getAllNormalUsersFromDB = async (query: Record<string, unknown>) => {
  const qb = new QueryBuilder(
    NormalUser.find({ isDeleted: false })
      .select(
        '_id id user designation name userName country device gender dateOfBirth email contactNo emergencyContactNo bloodGroup presentAddress permanentAddress profileImg signupBonusGiven engagementStatus kycVerified kycStatus status userLevel referralId referredBy lastActiveAt createdAt',
      )
      .sort({ createdAt: -1, _id: -1 }) // newest first
      .lean(),
    query
  )
    .search(NormalUserSearchableFields)
    .filter()
    .paginate()
    .fields();

  const users = await qb.modelQuery;
  const meta  = await qb.countTotal();

  // Normalize ids as strings for safe Map lookups
  const userIdStrings = users.map(u => String(u.user));

  // Fetch ALL fields from balance/promotion (no select)
  const [balances, promotions] = await Promise.all([
    UserBalance.find({ userId: { $in: userIdStrings.map(id => new Types.ObjectId(id)) } }).lean(),
    UserPromotion.find({ userId: { $in: userIdStrings.map(id => new Types.ObjectId(id)) } }).lean(),
  ]);

  // Build fast lookup maps using stringified userId
  const balMap   = new Map(balances.map(b => [String(b.userId), b]));
  const promoMap = new Map(promotions.map(p => [String(p.userId), p]));

  // Merge; always include keys with {} fallback
  const result = users.map(u => {
    const key = String(u.user);
    return {
      ...u,
      balanceSheet: balMap.get(key) ?? {},   // always present
      promotion:    promoMap.get(key) ?? {}, // always present
    };
  });

  return {
    result,
    meta: {
      ...meta,
      totalPage: Math.max(Math.ceil((meta.total ?? 0) / (meta.limit ?? 10)), 1),
    },
  };
};


// const getSingleNormalUserFromDB = async (id: string) => {
//   const result = await NormalUser.findOne({ user: id });
//   return result;
// };
const getSingleNormalUserFromDB = async (userId: string) => {
  const normalUser = await NormalUser.findOne({ user: userId });

  if (!normalUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'Normal user not found');
  }

  const userBalance = await UserBalance.findOne({ userId: new Types.ObjectId(userId) });

  const userPromotion = await UserPromotion.findOne({ userId: new Types.ObjectId(userId) });

  return {
    ...normalUser.toObject(),
    balanceSheet: userBalance ? userBalance.toObject() : {},
    promotion: userPromotion ? userPromotion.toObject() : null,
  };
};
const updateNormalUserIntoDB = async (
  userId: string,
  payload: Partial<TNormalUser>,
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID format');
  }
  // Convert `userId` to an `ObjectId` for querying by the `user` field
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Find the user by the `user` field and update
  const result = await NormalUser.findOneAndUpdate(
    { user: userObjectId }, // Match based on `user` field with `ObjectId`
    payload,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Normal user not found');
  }

  if (payload.email !== undefined || payload.dateOfBirth !== undefined) {
    const userPatch: Record<string, unknown> = {};
    if (payload.email !== undefined) userPatch.email = payload.email;
    if (payload.dateOfBirth !== undefined) userPatch.dateOfBirth = payload.dateOfBirth;
    await User.findByIdAndUpdate(userObjectId, userPatch);
  }

  return result;
};

const deleteNormalUserFromDB = async (userId: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    console.log('🔍 Looking for NormalUser with user field =', userId);

    const normalUser = await NormalUser.findOne({
      user: { $in: [userId, new mongoose.Types.ObjectId(userId)] },
    }).session(session);

    if (!normalUser) {
      throw new AppError(httpStatus.NOT_FOUND, `No NormalUser found for User._id = ${userId}`);
    }

    await NormalUser.findByIdAndDelete(normalUser._id, { session });

    const deletedUser = await User.findByIdAndDelete(userId, { session });

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete User');
    }

    await session.commitTransaction();
    await session.endSession();

    return {
      message: 'User and NormalUser deleted successfully',
      deletedUserId: deletedUser._id,
      deletedNormalUserId: normalUser._id,
    };
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();

    console.error('❌ Deletion failed:', err.message);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR,'Failed to delete normal user');
  }
};





export const NormalUserServices = {
  getAllNormalUsersFromDB,
  getSingleNormalUserFromDB,
  updateNormalUserIntoDB,
  deleteNormalUserFromDB,
};
