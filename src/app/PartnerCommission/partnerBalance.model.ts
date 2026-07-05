import { Schema, model } from 'mongoose';
import { TPartnerBalance } from './partnerCommission.interface';

const partnerBalanceSchema = new Schema<TPartnerBalance>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    partnerId: { type: String, required: true },
    currentBalance: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 },
    totalDeducted: { type: Number, default: 0 },
    totalWithdrawn: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const PartnerBalance = model<TPartnerBalance>(
  'PartnerBalance',
  partnerBalanceSchema,
);
