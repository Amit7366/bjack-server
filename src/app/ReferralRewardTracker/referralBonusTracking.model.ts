// models/referralBonusTracking.model.ts
import { Schema, model, Types } from 'mongoose';

const referralBonusTrackingSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true }, // Referrer
    referredUserId: { type: Types.ObjectId, ref: 'User', required: true },
    /** Bonus credited to referrer once referred user hits turnoverRequired. */
    bonusAmount: { type: Number, default: 300 },
    /** Lifetime turnover the referred user must complete. */
    turnoverRequired: { type: Number, default: 3000 },
    turnoverCompleted: { type: Number, default: 0 },
    /** True when referred user reached turnoverRequired. */
    isCompleted: { type: Boolean, default: false },
    /** True when referrer received bonus (once per referred user). */
    rewardPaid: { type: Boolean, default: false },
    rewardPaidAt: { type: Date, default: null },
  },
  { timestamps: true }
);
referralBonusTrackingSchema.index({ userId: 1, referredUserId: 1 }, { unique: true });
referralBonusTrackingSchema.index({ userId: 1, rewardPaid: 1 });
referralBonusTrackingSchema.index({ referredUserId: 1, isCompleted: 1, rewardPaid: 1 });
export const ReferralBonusTracking = model('ReferralBonusTracking', referralBonusTrackingSchema);
