import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import AppError from '../errors/AppError';
import { NormalUser } from '../NormalUser/normalUser.model';
import { User } from '../User/user.model';
import { sendImageToCloudinary } from '../utilis/sendImageToCloudinary';
import { TKycStatus } from './kyc.constant';

type KycFileMap = {
  front?: Express.Multer.File[];
  back?: Express.Multer.File[];
  selfie?: Express.Multer.File[];
};

export type SubmitKycPayload = {
  documentType: string;
  documentNo: string;
  documentExpiry: string;
};

async function uploadKycImage(userId: string, slot: string, file: Express.Multer.File) {
  const result = await sendImageToCloudinary(
    `kyc-${slot}-${userId}-${Date.now()}`,
    file.path,
  );
  const url = (result as { secure_url?: string }).secure_url;
  if (!url) {
    throw new AppError(httpStatus.BAD_REQUEST, `Failed to upload ${slot} document`);
  }
  return url;
}

function assertRequiredFiles(files: KycFileMap) {
  if (!files.front?.[0] || !files.back?.[0] || !files.selfie?.[0]) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Front, back, and selfie photos are required');
  }
}

function canSubmitKyc(currentStatus?: TKycStatus | null): boolean {
  return !currentStatus || currentStatus === 'rejected';
}

export async function submitKycDocuments(
  userId: string,
  payload: SubmitKycPayload,
  files: KycFileMap,
) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user id');
  }

  assertRequiredFiles(files);

  const userObjectId = new Types.ObjectId(userId);
  const user = await User.findById(userObjectId).select('kycStatus kycVerified userName');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!canSubmitKyc(user.kycStatus as TKycStatus | undefined)) {
    throw new AppError(
      httpStatus.CONFLICT,
      user.kycStatus === 'approved'
        ? 'KYC is already approved'
        : 'KYC submission is already pending review',
    );
  }

  const [frontUrl, backUrl, selfieUrl] = await Promise.all([
    uploadKycImage(userId, 'front', files.front![0]),
    uploadKycImage(userId, 'back', files.back![0]),
    uploadKycImage(userId, 'selfie', files.selfie![0]),
  ]);

  const expiryDate = new Date(`${payload.documentExpiry}T00:00:00.000Z`);
  if (Number.isNaN(expiryDate.getTime())) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid document expiry date');
  }

  const kycPatch = {
    kycStatus: 'pending' as const,
    kycVerified: false,
    kycDocumentType: payload.documentType,
    kycDocumentNo: payload.documentNo,
    kycDocumentExpiry: expiryDate,
    kycDocumentFrontUrl: frontUrl,
    kycDocumentBackUrl: backUrl,
    kycSelfieUrl: selfieUrl,
    kycSubmittedAt: new Date(),
    kycReviewedAt: null,
    kycReviewNote: null,
  };

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await User.updateOne({ _id: userObjectId }, { $set: kycPatch }, { session });
      await NormalUser.updateOne({ user: userObjectId }, { $set: kycPatch }, { session });
    });
  } finally {
    session.endSession();
  }

  return {
    kycStatus: 'pending' as const,
    kycVerified: false,
    documentType: payload.documentType,
    documentNo: payload.documentNo,
    documentExpiry: payload.documentExpiry,
    submittedAt: kycPatch.kycSubmittedAt,
  };
}

export async function getMyKycStatus(userId: string) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user id');
  }

  const user = await User.findById(userId).select(
    'kycStatus kycVerified kycDocumentType kycDocumentNo kycDocumentExpiry kycSubmittedAt kycReviewedAt kycReviewNote',
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return {
    kycStatus: user.kycStatus ?? null,
    kycVerified: Boolean(user.kycVerified),
    documentType: user.kycDocumentType ?? null,
    documentNo: user.kycDocumentNo ?? null,
    documentExpiry: user.kycDocumentExpiry
      ? user.kycDocumentExpiry.toISOString().slice(0, 10)
      : null,
    submittedAt: user.kycSubmittedAt ?? null,
    reviewedAt: user.kycReviewedAt ?? null,
    reviewNote: user.kycReviewNote ?? null,
  };
}

export async function listKycSubmissions(query: {
  status?: TKycStatus;
  page?: number;
  limit?: number;
}) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {
    kycStatus: { $in: ['pending', 'approved', 'rejected'] },
  };
  if (query.status) {
    filter.kycStatus = query.status;
  }

  const [rows, total] = await Promise.all([
    User.find(filter)
      .select(
        'id userName contactNo kycStatus kycVerified kycDocumentType kycDocumentNo kycDocumentExpiry kycSubmittedAt kycReviewedAt createdAt',
      )
      .sort({ kycSubmittedAt: -1, updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return {
    result: rows.map((row) => ({
      userId: String(row._id),
      memberId: row.id ?? null,
      userName: row.userName ?? null,
      contactNo: row.contactNo ?? null,
      kycStatus: row.kycStatus ?? null,
      kycVerified: Boolean(row.kycVerified),
      documentType: row.kycDocumentType ?? null,
      documentNo: row.kycDocumentNo ?? null,
      documentExpiry: row.kycDocumentExpiry
        ? new Date(row.kycDocumentExpiry).toISOString().slice(0, 10)
        : null,
      submittedAt: row.kycSubmittedAt ?? null,
      reviewedAt: row.kycReviewedAt ?? null,
    })),
    meta: {
      page,
      limit,
      total,
      totalPage: Math.max(Math.ceil(total / limit), 1),
    },
  };
}

export async function getKycSubmissionForAdmin(userId: string) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user id');
  }

  const user = await User.findById(userId).select(
    'id userName contactNo email kycStatus kycVerified kycDocumentType kycDocumentNo kycDocumentExpiry kycDocumentFrontUrl kycDocumentBackUrl kycSelfieUrl kycSubmittedAt kycReviewedAt kycReviewNote',
  );

  if (!user || !user.kycStatus) {
    throw new AppError(httpStatus.NOT_FOUND, 'KYC submission not found');
  }

  return {
    userId: String(user._id),
    memberId: user.id ?? null,
    userName: user.userName ?? null,
    contactNo: user.contactNo ?? null,
    email: user.email ?? null,
    kycStatus: user.kycStatus,
    kycVerified: Boolean(user.kycVerified),
    documentType: user.kycDocumentType ?? null,
    documentNo: user.kycDocumentNo ?? null,
    documentExpiry: user.kycDocumentExpiry
      ? user.kycDocumentExpiry.toISOString().slice(0, 10)
      : null,
    documentUrls: {
      front: user.kycDocumentFrontUrl ?? null,
      back: user.kycDocumentBackUrl ?? null,
      selfie: user.kycSelfieUrl ?? null,
    },
    submittedAt: user.kycSubmittedAt ?? null,
    reviewedAt: user.kycReviewedAt ?? null,
    reviewNote: user.kycReviewNote ?? null,
  };
}

export async function updateKycStatusForAdmin(
  userId: string,
  status: 'approved' | 'rejected',
  note?: string,
) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user id');
  }

  const userObjectId = new Types.ObjectId(userId);
  const user = await User.findById(userObjectId).select('kycStatus');
  if (!user?.kycStatus) {
    throw new AppError(httpStatus.NOT_FOUND, 'KYC submission not found');
  }

  const kycVerified = status === 'approved';
  const kycPatch = {
    kycStatus: status,
    kycVerified,
    kycReviewedAt: new Date(),
    kycReviewNote: note?.trim() || null,
  };

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await User.updateOne({ _id: userObjectId }, { $set: kycPatch }, { session });
      await NormalUser.updateOne({ user: userObjectId }, { $set: kycPatch }, { session });
    });
  } finally {
    session.endSession();
  }

  return {
    userId,
    kycStatus: status,
    kycVerified,
    reviewedAt: kycPatch.kycReviewedAt,
    reviewNote: kycPatch.kycReviewNote,
  };
}

export const KycServices = {
  submitKycDocuments,
  getMyKycStatus,
  listKycSubmissions,
  getKycSubmissionForAdmin,
  updateKycStatusForAdmin,
};
