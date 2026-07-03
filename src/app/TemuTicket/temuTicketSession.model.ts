import { Schema, model, Types } from 'mongoose';

export type TemuTicketSessionStatus = 'active' | 'completed' | 'expired';

export interface ITemuTicketSession {
  userId: Types.ObjectId;
  targetAmount: number;
  progressAmount: number;
  claimedToWallet: number;
  primaryClaimed: boolean;
  finalClaimed: boolean;
  inviteCount: number;
  status: TemuTicketSessionStatus;
  expiresAt: Date;
}

const temuTicketSessionSchema = new Schema<ITemuTicketSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetAmount: { type: Number, required: true },
    progressAmount: { type: Number, required: true, default: 0 },
    claimedToWallet: { type: Number, required: true, default: 0 },
    primaryClaimed: { type: Boolean, default: false, index: true },
    finalClaimed: { type: Boolean, default: false },
    inviteCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'completed', 'expired'],
      default: 'active',
      index: true,
    },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

temuTicketSessionSchema.index({ userId: 1, status: 1 });

export const TemuTicketSession = model<ITemuTicketSession>(
  'TemuTicketSession',
  temuTicketSessionSchema
);
