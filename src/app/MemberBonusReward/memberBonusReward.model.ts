import { Schema, model, Types } from 'mongoose';

const memberBonusRewardStateSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true, unique: true },
    lastClaimedAt: { type: Date, default: null },
    totalBonusClaimed: { type: Number, default: 0 },
    claimCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

memberBonusRewardStateSchema.index({ userId: 1 });

export const MemberBonusRewardState = model(
  'MemberBonusRewardState',
  memberBonusRewardStateSchema
);
