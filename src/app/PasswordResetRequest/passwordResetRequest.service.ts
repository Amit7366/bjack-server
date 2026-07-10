import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Types } from 'mongoose';
import config from '../config';
import AppError from '../errors/AppError';
import { User } from '../User/user.model';
import { TPasswordResetStatus } from './passwordResetRequest.constant';
import { PasswordResetRequest } from './passwordResetRequest.model';

function normalizeContactCandidates(contactNo: string): string[] {
  const trimmed = contactNo.trim();
  const digits = trimmed.replace(/\D/g, '');
  const candidates = new Set<string>([trimmed]);

  if (digits) {
    candidates.add(digits);
    candidates.add(`+${digits}`);
    if (digits.startsWith('880')) {
      candidates.add(`+${digits}`);
      candidates.add(digits.slice(3));
      candidates.add(`0${digits.slice(3)}`);
    } else if (digits.startsWith('91') && digits.length > 10) {
      candidates.add(`+${digits}`);
      candidates.add(digits.slice(2));
    } else if (digits.length === 11 && digits.startsWith('0')) {
      candidates.add(`+880${digits.slice(1)}`);
      candidates.add(`880${digits.slice(1)}`);
    } else if (digits.length === 10) {
      candidates.add(`+880${digits}`);
      candidates.add(`880${digits}`);
      candidates.add(`0${digits}`);
      candidates.add(`+91${digits}`);
    }
  }

  return [...candidates];
}

function mapRequestRow(doc: {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  contactNo: string;
  status: TPasswordResetStatus;
  adminNote?: string | null;
  processedBy?: Types.ObjectId | null;
  processedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: String(doc._id),
    _id: String(doc._id),
    userId: String(doc.userId),
    userName: doc.userName,
    contactNo: doc.contactNo,
    status: doc.status,
    adminNote: doc.adminNote ?? null,
    processedBy: doc.processedBy ? String(doc.processedBy) : null,
    processedAt: doc.processedAt ? doc.processedAt.toISOString() : null,
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : null,
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : null,
  };
}

export async function createPasswordResetRequest(payload: {
  userName: string;
  contactNo: string;
  newPassword: string;
}) {
  const userName = payload.userName.trim();
  const contactCandidates = normalizeContactCandidates(payload.contactNo);

  const user = await User.findOne({
    userName,
    contactNo: { $in: contactCandidates },
  }).select('_id id userName contactNo isDeleted status');

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No account found with this username and phone number',
    );
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This account is deleted');
  }

  if (user.status === 'deactivated') {
    throw new AppError(httpStatus.FORBIDDEN, 'This account is blocked');
  }

  const existingPending = await PasswordResetRequest.findOne({
    userId: user._id,
    status: 'pending',
  });

  if (existingPending) {
    throw new AppError(
      httpStatus.CONFLICT,
      'A password reset request is already pending. Please wait for admin approval.',
    );
  }

  const newPasswordHash = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round) || 10,
  );

  const request = await PasswordResetRequest.create({
    userId: user._id,
    userName: user.userName ?? userName,
    contactNo: user.contactNo ?? payload.contactNo.trim(),
    newPasswordHash,
    newPasswordPlain: payload.newPassword,
    status: 'pending',
  });

  return mapRequestRow(request);
}

export async function listPasswordResetRequests(filters: {
  status?: TPasswordResetStatus;
  page?: number;
  limit?: number;
}) {
  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const limit = filters.limit && filters.limit > 0 ? Math.min(filters.limit, 100) : 50;
  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = {};
  if (filters.status) query.status = filters.status;

  const [rows, total] = await Promise.all([
    PasswordResetRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    PasswordResetRequest.countDocuments(query),
  ]);

  return {
    meta: { page, limit, total },
    result: rows.map((row) => mapRequestRow(row as typeof rows[number] & { _id: Types.ObjectId })),
  };
}

export async function approvePasswordResetRequest(
  requestId: string,
  adminUserId: string,
) {
  if (!Types.ObjectId.isValid(requestId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid request id');
  }

  const request = await PasswordResetRequest.findById(requestId).select(
    '+newPasswordHash +newPasswordPlain',
  );
  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, 'Password reset request not found');
  }
  if (request.status !== 'pending') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Request is not pending');
  }

  const user = await User.findById(request.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Pre-hashed value via updateOne — skips User pre('save') bcrypt hook
  await User.updateOne(
    { _id: request.userId },
    {
      $set: {
        password: request.newPasswordHash,
        needsPasswordChange: false,
        passwordChangeAt: new Date(),
        ...(request.newPasswordPlain
          ? { userPlainPassword: request.newPasswordPlain }
          : {}),
      },
    },
  );

  request.status = 'approved';
  request.processedAt = new Date();
  if (Types.ObjectId.isValid(adminUserId)) {
    request.processedBy = new Types.ObjectId(adminUserId);
  }
  await request.save();

  return mapRequestRow(request);
}

export async function rejectPasswordResetRequest(
  requestId: string,
  adminUserId: string,
  adminNote?: string,
) {
  if (!Types.ObjectId.isValid(requestId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid request id');
  }

  const request = await PasswordResetRequest.findById(requestId);
  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, 'Password reset request not found');
  }
  if (request.status !== 'pending') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Request is not pending');
  }

  request.status = 'rejected';
  request.processedAt = new Date();
  if (adminNote?.trim()) request.adminNote = adminNote.trim();
  if (Types.ObjectId.isValid(adminUserId)) {
    request.processedBy = new Types.ObjectId(adminUserId);
  }
  await request.save();

  return mapRequestRow(request);
}
