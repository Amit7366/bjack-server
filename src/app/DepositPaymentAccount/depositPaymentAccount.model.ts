import { Schema, model } from 'mongoose';
import {
  DepositPaymentAccountModel,
  TDepositPaymentAccount,
} from './depositPaymentAccount.interface';
import { DEFAULT_PAYMENT_TYPE, PAYMENT_METHODS, PAYMENT_TYPES } from './depositPaymentAccount.constant';

const depositPaymentAccountSchema = new Schema<TDepositPaymentAccount, DepositPaymentAccountModel>(
  {
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      required: true,
      index: true,
    },
    paymentType: {
      type: String,
      enum: PAYMENT_TYPES,
      default: DEFAULT_PAYMENT_TYPE,
    },
    channelId: {
      type: String,
      required: true,
      trim: true,
    },
    channelName: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },
    accountHolderName: {
      type: String,
      trim: true,
    },
    recommended: {
      type: Boolean,
      default: false,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

depositPaymentAccountSchema.index(
  { paymentMethod: 1, channelId: 1 },
  { unique: true },
);

export const DepositPaymentAccount = model<TDepositPaymentAccount, DepositPaymentAccountModel>(
  'DepositPaymentAccount',
  depositPaymentAccountSchema,
);
