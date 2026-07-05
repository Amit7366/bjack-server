import { Schema, model } from 'mongoose';
import { TPartnerCommissionLedger } from './partnerCommission.interface';

const partnerCommissionLedgerSchema = new Schema<TPartnerCommissionLedger>(
  {
    partnerUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['deposit_commission', 'withdraw_commission'],
      required: true,
    },
    amount: { type: Number, required: true },
    commissionRate: { type: Number, required: true },
    baseAmount: { type: Number, required: true },
    referredUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sourceTransactionId: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true,
    },
    balanceAfter: { type: Number, required: true },
  },
  { timestamps: true },
);

partnerCommissionLedgerSchema.index(
  { sourceTransactionId: 1, type: 1 },
  { unique: true },
);

export const PartnerCommissionLedger = model<TPartnerCommissionLedger>(
  'PartnerCommissionLedger',
  partnerCommissionLedgerSchema,
);
