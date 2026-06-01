import { Schema, model, Types } from 'mongoose';

const userBalanceSchema = new Schema(
  {
    userId: { type: Types.ObjectId, required: true, unique: true, ref: 'User' },
    id: { type: String, required: true, unique: true },

    totalDeposit: { type: Number, default: 0 },
    totalWithdraw: { type: Number, default: 0 },
    currentBalance: { type: Number, default: 0 },

    currentCoinBalance: { type: Number, default: 300 },
    // ✅ New Field
    storeDbBalance: { type: Number, default: 0 },
    totalCoinDeposit: { type: Number, default: 300 },
    totalCoinWithdraw: { type: Number, default: 0 },

    lockedBalance: { type: Number, default: 0 },

    // ✅ Daily spin (rolling 24 hours)
    lastSpinAt: { type: Date, default: null },
    nextSpinAt: { type: Date, default: null },
    lastSpinAmount: { type: Number, default: 0 },
    totalSpinWon: { type: Number, default: 0 },

    /** Last incremental sync from game tx provider (txserver). */
    lastGameSyncAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false }
);

userBalanceSchema.index({ userId: 1 });
userBalanceSchema.index({ id: 1 }, { unique: true });
userBalanceSchema.index({ nextSpinAt: 1 });

export const UserBalance = model('UserBalance', userBalanceSchema);
