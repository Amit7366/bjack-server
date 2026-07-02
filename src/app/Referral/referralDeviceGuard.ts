import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import AppError from '../errors/AppError';
import { NormalUser } from '../NormalUser/normalUser.model';
import { User } from '../User/user.model';

export const SELF_REFERRAL_DEVICE_MESSAGE =
  'You cannot register with your own referral code on this device. Remove the referral link and try again.';

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
