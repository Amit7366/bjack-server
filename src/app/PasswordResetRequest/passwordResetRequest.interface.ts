import { Types } from 'mongoose';
import { TPasswordResetStatus } from './passwordResetRequest.constant';

export type TPasswordResetRequest = {
  userId: Types.ObjectId;
  userName: string;
  contactNo: string;
  newPasswordHash: string;
  /** Plaintext kept for admin ops display only; never returned in public APIs */
  newPasswordPlain?: string;
  status: TPasswordResetStatus;
  adminNote?: string;
  processedBy?: Types.ObjectId;
  processedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};
