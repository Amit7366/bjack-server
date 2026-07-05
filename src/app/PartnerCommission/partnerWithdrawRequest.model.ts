import { Schema, model } from 'mongoose';
import { TPartnerWithdrawRequest } from './partnerCommission.interface';

const partnerWithdrawRequestSchema = new Schema<TPartnerWithdrawRequest>(
  {
    partnerUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['bkash', 'nagad', 'rocket'],
      required: true,
    },
    walletNumber: { type: String, required: true },
    accountHolderName: { type: String, required: true },
    adminNote: { type: String },
    processedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    processedAt: { type: Date },
  },
  { timestamps: true },
);

export const PartnerWithdrawRequest = model<TPartnerWithdrawRequest>(
  'PartnerWithdrawRequest',
  partnerWithdrawRequestSchema,
);
