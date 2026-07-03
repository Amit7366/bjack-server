import { Schema, model, Types } from 'mongoose';
import type { RescueFundVariant } from './rescueFund.constants';

export interface IRescueFundClaim {
  userId: Types.ObjectId;
  variant: RescueFundVariant;
  dayKey: string;
  totalLoss: number;
  receivableAmount: number;
  claimedAmount: number;
  depositAmount: number;
  totalBet: number;
  totalWin: number;
  turnoverRequired: number;
}

const rescueFundClaimSchema = new Schema<IRescueFundClaim>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    variant: {
      type: String,
      enum: ['sports', 'loss-compensation'],
      required: true,
    },
    dayKey: { type: String, required: true, index: true },
    totalLoss: { type: Number, required: true },
    receivableAmount: { type: Number, required: true },
    claimedAmount: { type: Number, required: true },
    depositAmount: { type: Number, default: 0 },
    totalBet: { type: Number, default: 0 },
    totalWin: { type: Number, default: 0 },
    turnoverRequired: { type: Number, required: true },
  },
  { timestamps: true }
);

rescueFundClaimSchema.index({ userId: 1, variant: 1, dayKey: 1 }, { unique: true });

export const RescueFundClaim = model<IRescueFundClaim>(
  'RescueFundClaim',
  rescueFundClaimSchema
);
