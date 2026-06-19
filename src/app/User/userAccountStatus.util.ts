import httpStatus from 'http-status';
import { Types } from 'mongoose';
import AppError from '../errors/AppError';
import { User } from './user.model';

export type TUserAccountStatus = 'active' | 'frozen' | 'deactivated' | 'pending';

const STATUS_MESSAGES: Record<Exclude<TUserAccountStatus, 'active'>, string> = {
  frozen: 'Your account is temporarily frozen. Please contact support.',
  deactivated: 'Your account is deactivated. This action is not allowed.',
  pending: 'Your account is under review. Please complete verification.',
};

export function isAccountActive(status?: string | null): boolean {
  return !status || status === 'active';
}

export function accountStatusMessage(status: string): string {
  if (status === 'active') return '';
  return (
    STATUS_MESSAGES[status as Exclude<TUserAccountStatus, 'active'>] ||
    'This action is not allowed for your account.'
  );
}

export async function getUserAccountStatus(userId: string): Promise<TUserAccountStatus> {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user id');
  }

  const user = await User.findById(userId).select('status').lean();
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return (user.status as TUserAccountStatus) ?? 'active';
}

export async function assertAccountActiveForRestrictedAction(userId: string): Promise<void> {
  const status = await getUserAccountStatus(userId);
  if (isAccountActive(status)) return;

  throw new AppError(httpStatus.FORBIDDEN, accountStatusMessage(status));
}

export function accountStatusEligibilityReason(status: string): string | null {
  if (isAccountActive(status)) return null;
  return accountStatusMessage(status);
}
