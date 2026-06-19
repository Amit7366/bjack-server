import httpStatus from 'http-status';
import { Types } from 'mongoose';
import AppError from '../errors/AppError';
import { NormalUser } from '../NormalUser/normalUser.model';
import { User } from '../User/user.model';
import { sendImageToCloudinary } from '../utilis/sendImageToCloudinary';
import { createSuggestionCaptcha, verifySuggestionCaptcha } from './suggestion.captcha';
import { TSuggestionCategory, TSuggestionStatus } from './suggestion.constant';
import { MemberSuggestion } from './suggestion.model';

export type SubmitSuggestionPayload = {
  category: TSuggestionCategory;
  message: string;
  captchaId: string;
  captchaCode: string;
};

async function uploadSuggestionImage(userId: string, file: Express.Multer.File) {
  const result = await sendImageToCloudinary(
    `suggestion-${userId}-${Date.now()}`,
    file.path,
  );
  const url = (result as { secure_url?: string }).secure_url;
  if (!url) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to upload image');
  }
  return url;
}

function mapSuggestionRow(doc: {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  memberId?: string | null;
  userName?: string | null;
  contactNo?: string | null;
  category: TSuggestionCategory;
  message: string;
  imageUrl?: string | null;
  status: TSuggestionStatus;
  reviewedAt?: Date | null;
  adminNote?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: String(doc._id),
    userId: String(doc.userId),
    memberId: doc.memberId ?? null,
    userName: doc.userName ?? null,
    contactNo: doc.contactNo ?? null,
    category: doc.category,
    message: doc.message,
    imageUrl: doc.imageUrl ?? null,
    status: doc.status,
    reviewedAt: doc.reviewedAt ? doc.reviewedAt.toISOString() : null,
    adminNote: doc.adminNote ?? null,
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : null,
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : null,
  };
}

export function getSuggestionCaptcha() {
  return createSuggestionCaptcha();
}

export async function submitMemberSuggestion(
  userId: string,
  payload: SubmitSuggestionPayload,
  imageFile?: Express.Multer.File,
) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user id');
  }

  if (!verifySuggestionCaptcha(payload.captchaId, payload.captchaCode)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired verification code');
  }

  const userObjectId = new Types.ObjectId(userId);
  const [user, normalUser] = await Promise.all([
    User.findById(userObjectId).select('id userName contactNo'),
    NormalUser.findOne({ user: userObjectId }).select('contactNo id'),
  ]);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  let imageUrl: string | undefined;
  if (imageFile) {
    imageUrl = await uploadSuggestionImage(userId, imageFile);
  }

  const suggestion = await MemberSuggestion.create({
    userId: userObjectId,
    memberId: user.id ?? normalUser?.id ?? null,
    userName: user.userName ?? null,
    contactNo: normalUser?.contactNo ?? user.contactNo ?? null,
    category: payload.category,
    message: payload.message.trim(),
    imageUrl: imageUrl ?? null,
    status: 'pending',
  });

  return mapSuggestionRow(suggestion);
}

export async function listSuggestionsForAdmin(filters: {
  status?: TSuggestionStatus;
  category?: TSuggestionCategory;
  page?: number;
  limit?: number;
}) {
  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const limit = filters.limit && filters.limit > 0 ? Math.min(filters.limit, 100) : 20;
  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = {};
  if (filters.status) query.status = filters.status;
  if (filters.category) query.category = filters.category;

  const [rows, total] = await Promise.all([
    MemberSuggestion.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    MemberSuggestion.countDocuments(query),
  ]);

  return {
    result: rows.map(mapSuggestionRow),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function getSuggestionForAdmin(suggestionId: string) {
  if (!Types.ObjectId.isValid(suggestionId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid suggestion id');
  }

  const suggestion = await MemberSuggestion.findById(suggestionId);
  if (!suggestion) {
    throw new AppError(httpStatus.NOT_FOUND, 'Suggestion not found');
  }

  return mapSuggestionRow(suggestion);
}

export async function markSuggestionReviewed(
  suggestionId: string,
  adminUserId: string,
  adminNote?: string,
) {
  if (!Types.ObjectId.isValid(suggestionId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid suggestion id');
  }

  const suggestion = await MemberSuggestion.findByIdAndUpdate(
    suggestionId,
    {
      status: 'reviewed',
      reviewedAt: new Date(),
      reviewedBy: Types.ObjectId.isValid(adminUserId) ? new Types.ObjectId(adminUserId) : null,
      ...(adminNote ? { adminNote } : {}),
    },
    { new: true },
  );

  if (!suggestion) {
    throw new AppError(httpStatus.NOT_FOUND, 'Suggestion not found');
  }

  return mapSuggestionRow(suggestion);
}

export const SuggestionServices = {
  getSuggestionCaptcha,
  submitMemberSuggestion,
  listSuggestionsForAdmin,
  getSuggestionForAdmin,
  markSuggestionReviewed,
};
