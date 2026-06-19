import { Schema, model } from 'mongoose';
import { IRewardOfferClaim } from './rewardOffer.interface';

const rewardOfferClaimSchema = new Schema<IRewardOfferClaim>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    offerId: { type: Schema.Types.ObjectId, ref: 'RewardOffer', required: true },
    lastClaimedAt: { type: Date, default: null },
    claimCount: { type: Number, default: 0 },
    totalClaimed: { type: Number, default: 0 },
  },
  { timestamps: true },
);

rewardOfferClaimSchema.index({ userId: 1, offerId: 1 }, { unique: true });
rewardOfferClaimSchema.index({ userId: 1 });

export const RewardOfferClaim = model<IRewardOfferClaim>(
  'RewardOfferClaim',
  rewardOfferClaimSchema,
);
