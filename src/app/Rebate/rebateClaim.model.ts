import mongoose, { Schema, model, Model, Types } from 'mongoose';
import type { RebateCategory } from '../GameEligibility/gameType.util';

export type RebateCategorySnapshot = Record<
  RebateCategory,
  { turnover: number; rebate: number }
>;

export type RebateCategoryAmounts = Record<RebateCategory, number>;

export interface IRebateClaim {
  userId: Types.ObjectId;
  dayKey: string;
  orderNo: string;
  amount: number;
  primaryCategory: RebateCategory;
  categoryBreakdown: RebateCategorySnapshot;
  claimedCategoryAmounts?: RebateCategoryAmounts;
  totalTurnover: number;
  totalEarnedRebate: number;
  claimedBefore: number;
}

const categorySnapshotSchema = new Schema(
  {
    turnover: { type: Number, default: 0 },
    rebate: { type: Number, default: 0 },
  },
  { _id: false }
);

const categoryAmountsSchema = new Schema(
  {
    slot: { type: Number, default: 0 },
    live: { type: Number, default: 0 },
    sports: { type: Number, default: 0 },
    poker: { type: Number, default: 0 },
    fishing: { type: Number, default: 0 },
  },
  { _id: false }
);

const rebateClaimSchema = new Schema<IRebateClaim>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    dayKey: { type: String, required: true, index: true },
    orderNo: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    primaryCategory: {
      type: String,
      enum: ['slot', 'live', 'sports', 'poker', 'fishing'],
      required: true,
    },
    categoryBreakdown: {
      slot: { type: categorySnapshotSchema, default: () => ({ turnover: 0, rebate: 0 }) },
      live: { type: categorySnapshotSchema, default: () => ({ turnover: 0, rebate: 0 }) },
      sports: { type: categorySnapshotSchema, default: () => ({ turnover: 0, rebate: 0 }) },
      poker: { type: categorySnapshotSchema, default: () => ({ turnover: 0, rebate: 0 }) },
      fishing: { type: categorySnapshotSchema, default: () => ({ turnover: 0, rebate: 0 }) },
    },
    claimedCategoryAmounts: {
      type: categoryAmountsSchema,
      default: () => ({ slot: 0, live: 0, sports: 0, poker: 0, fishing: 0 }),
    },
    totalTurnover: { type: Number, required: true },
    totalEarnedRebate: { type: Number, required: true },
    claimedBefore: { type: Number, required: true, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

rebateClaimSchema.index({ userId: 1, dayKey: 1, createdAt: -1 });
rebateClaimSchema.index({ userId: 1, createdAt: -1 });

export const RebateClaim: Model<IRebateClaim> =
  (mongoose.models.RebateClaim as Model<IRebateClaim>) ||
  model<IRebateClaim>('RebateClaim', rebateClaimSchema, 'rebate_claims');
