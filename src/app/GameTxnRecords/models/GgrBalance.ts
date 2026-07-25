import { Schema, model, Model } from 'mongoose';

export const GGR_BALANCE_KEY = 'default';
export const GGR_DEFAULT_TOTAL = 45500;
export const GGR_DEFAULT_USED = 13000;
export const GGR_WARNING_THRESHOLD = 10000;
export const GGR_LOSS_FEE_RATE = 0.1;

export interface IGgrBalance {
  key: string;
  totalGgr: number;
  usedGgr: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ggrBalanceSchema = new Schema<IGgrBalance>(
  {
    key: { type: String, required: true, unique: true, default: GGR_BALANCE_KEY },
    totalGgr: { type: Number, required: true, default: GGR_DEFAULT_TOTAL },
    usedGgr: { type: Number, required: true, default: GGR_DEFAULT_USED },
  },
  { timestamps: true, versionKey: false, collection: 'ggr_balances' }
);

export const GgrBalance: Model<IGgrBalance> =
  (global as any).GgrBalance || model<IGgrBalance>('GgrBalance', ggrBalanceSchema);

(global as any).GgrBalance = GgrBalance;
