import { Types } from 'mongoose';

export type RewardOfferCriteriaType = 'none' | 'daily_deposit' | 'total_deposit' | 'referral';

export type LocalizedText = {
  en: string;
  bn: string;
  hi: string;
};

export interface IRewardOffer {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  bonusAmount: number;
  turnoverMultiplier: number;
  cooldownHours: number;
  criteriaType: RewardOfferCriteriaType;
  criteriaValue: number;
  sortOrder: number;
  isActive: boolean;
}

export interface IRewardOfferClaim {
  userId: Types.ObjectId;
  offerId: Types.ObjectId;
  lastClaimedAt: Date | null;
  claimCount: number;
  totalClaimed: number;
}

export type RewardOfferCriteriaProgress = {
  current: number;
  required: number;
};

export type RewardOfferMemberView = {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  bonusAmount: number;
  turnoverMultiplier: number;
  cooldownHours: number;
  criteriaType: RewardOfferCriteriaType;
  criteriaValue: number;
  sortOrder: number;
  canClaim: boolean;
  criteriaMet: boolean;
  criteriaProgress: RewardOfferCriteriaProgress | null;
  lastClaimedAt: string | null;
  nextClaimAt: string | null;
  remainingMs: number;
  claimCount: number;
  totalClaimed: number;
};
