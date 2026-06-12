import { Schema, model, Types } from 'mongoose';

const signInRewardStateSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true, unique: true },
    /** Next day index (1–7) the user can claim when eligible */
    nextDay: { type: Number, default: 1, min: 1, max: 7 },
    lastClaimedAt: { type: Date, default: null },
    lastClaimedDay: { type: Number, default: 0, min: 0, max: 7 },
    totalBonusClaimed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

signInRewardStateSchema.index({ userId: 1 });

export const SignInRewardState = model('SignInRewardState', signInRewardStateSchema);
