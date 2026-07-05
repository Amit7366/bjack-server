import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import AppError from '../errors/AppError';
import { NormalUser } from '../NormalUser/normalUser.model';
import { User } from '../User/user.model';

export const SELF_REFERRAL_DEVICE_MESSAGE =
  'You cannot register with your own referral code on this device. Remove the referral link and try again.';

export const MAX_ACCOUNTS_PER_DEVICE = 3;

export const DEVICE_ACCOUNT_LIMIT_MESSAGE =
  'This device already has the maximum number of accounts (3).';

export type DeviceRegistrationStatus = {
  accountCount: number;
  maxAccounts: number;
  canRegister: boolean;
};

type AssertSelfReferralInput = {
  referredBy?: string | null;
  deviceFingerprint?: string | null;
};

type RecordUserDeviceInput = {
  userId: string | Types.ObjectId;
  deviceFingerprint?: string | null;
  ip?: string | null;
  session?: mongoose.ClientSession;
};

function normalizeFingerprint(value?: string | null): string | null {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  return trimmed.length > 0 ? trimmed : null;
}

function deviceFingerprintFilter(fingerprint: string) {
  return {
    $or: [
      { deviceFingerprint: fingerprint },
      { knownDeviceFingerprints: fingerprint },
    ],
  };
}

/**
 * Count all accounts ever linked to this device (including deleted).
 */
export async function countAccountsOnDevice(
  deviceFingerprint?: string | null,
): Promise<number> {
  const fingerprint = normalizeFingerprint(deviceFingerprint);
  if (!fingerprint) return 0;

  return NormalUser.countDocuments(deviceFingerprintFilter(fingerprint));
}

/**
 * Reject signup when this device already has the maximum allowed accounts.
 */
export async function assertDeviceAccountLimit(
  deviceFingerprint?: string | null,
): Promise<void> {
  const fingerprint = normalizeFingerprint(deviceFingerprint);
  if (!fingerprint) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Device verification is required to register.',
    );
  }

  const accountCount = await countAccountsOnDevice(fingerprint);
  if (accountCount >= MAX_ACCOUNTS_PER_DEVICE) {
    throw new AppError(httpStatus.CONFLICT, DEVICE_ACCOUNT_LIMIT_MESSAGE);
  }
}

export async function getDeviceRegistrationStatus(
  deviceFingerprint?: string | null,
): Promise<DeviceRegistrationStatus> {
  const accountCount = await countAccountsOnDevice(deviceFingerprint);

  return {
    accountCount,
    maxAccounts: MAX_ACCOUNTS_PER_DEVICE,
    canRegister: accountCount < MAX_ACCOUNTS_PER_DEVICE,
  };
}

/**
 * Reject signup when the referrer already has an account linked to this device.
 */
export async function assertNotSelfReferralOnDevice({
  referredBy,
  deviceFingerprint,
}: AssertSelfReferralInput): Promise<void> {
  const referralCode = typeof referredBy === 'string' ? referredBy.trim() : '';
  const fingerprint = normalizeFingerprint(deviceFingerprint);

  if (!referralCode || referralCode === 'self' || !fingerprint) {
    return;
  }

  const referrer = await User.findOne({ referralId: referralCode }).select('_id').lean();
  if (!referrer?._id) {
    return;
  }

  const ownsDevice = await NormalUser.findOne({
    user: referrer._id,
    $or: [
      { deviceFingerprint: fingerprint },
      { knownDeviceFingerprints: fingerprint },
    ],
  })
    .select('_id')
    .lean();

  if (ownsDevice) {
    throw new AppError(httpStatus.CONFLICT, SELF_REFERRAL_DEVICE_MESSAGE);
  }
}

/**
 * Persist the latest device fingerprint and accumulate known devices for a user.
 */
export async function recordUserDevice({
  userId,
  deviceFingerprint,
  ip,
  session,
}: RecordUserDeviceInput): Promise<void> {
  const fingerprint = normalizeFingerprint(deviceFingerprint);
  if (!fingerprint) return;

  const userObjectId =
    userId instanceof Types.ObjectId ? userId : new Types.ObjectId(String(userId));

  const update: Record<string, unknown> = {
    $set: { deviceFingerprint: fingerprint },
    $addToSet: { knownDeviceFingerprints: fingerprint },
  };

  const normalizedIp = typeof ip === 'string' ? ip.trim() : '';
  if (normalizedIp) {
    (update.$set as Record<string, string>).ip = normalizedIp;
  }

  await NormalUser.updateOne({ user: userObjectId }, update, { session });
}
