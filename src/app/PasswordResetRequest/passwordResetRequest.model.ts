import { Schema, model } from 'mongoose';
import { PASSWORD_RESET_STATUSES } from './passwordResetRequest.constant';
import { TPasswordResetRequest } from './passwordResetRequest.interface';

const passwordResetRequestSchema = new Schema<TPasswordResetRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userName: { type: String, required: true, index: true },
    contactNo: { type: String, required: true },
    newPasswordHash: { type: String, required: true, select: false },
    newPasswordPlain: { type: String, select: false },
    status: {
      type: String,
      enum: PASSWORD_RESET_STATUSES,
      default: 'pending',
      index: true,
    },
    adminNote: { type: String },
    processedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    processedAt: { type: Date },
  },
  { timestamps: true },
);

passwordResetRequestSchema.index({ userId: 1, status: 1 });

export const PasswordResetRequest = model<TPasswordResetRequest>(
  'PasswordResetRequest',
  passwordResetRequestSchema,
);
