import { Schema, model } from 'mongoose';
import { IRewardOffer } from './rewardOffer.interface';

const localizedTextSchema = new Schema(
  {
    en: { type: String, required: true },
    bn: { type: String, required: true },
    hi: { type: String, required: true },
  },
  { _id: false },
);

const rewardOfferSchema = new Schema<IRewardOffer>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: localizedTextSchema, required: true },
    description: { type: localizedTextSchema, required: true },
    bonusAmount: { type: Number, required: true, min: 0 },
    turnoverMultiplier: { type: Number, default: 1, min: 0 },
    cooldownHours: { type: Number, required: true, min: 1 },
    criteriaType: {
      type: String,
      enum: ['none', 'daily_deposit', 'total_deposit', 'referral'],
      default: 'none',
    },
    criteriaValue: { type: Number, default: 0, min: 0 },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

rewardOfferSchema.index({ isActive: 1, sortOrder: 1 });

export const RewardOffer = model<IRewardOffer>('RewardOffer', rewardOfferSchema);
