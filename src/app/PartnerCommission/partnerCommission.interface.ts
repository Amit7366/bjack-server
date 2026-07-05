import { Types } from 'mongoose';

export type TPartnerCommissionLedgerType =
  | 'deposit_commission'
  | 'withdraw_commission';

export type TPartnerWithdrawStatus = 'pending' | 'approved' | 'rejected';

export type TPartnerPaymentMethod = 'bkash' | 'nagad' | 'rocket';

export type TPartnerBalance = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  partnerId: string;
  currentBalance: number;
  totalEarned: number;
  totalDeducted: number;
  totalWithdrawn: number;
};

export type TPartnerCommissionLedger = {
  _id: Types.ObjectId;
  partnerUserId: Types.ObjectId;
  type: TPartnerCommissionLedgerType;
  amount: number;
  commissionRate: number;
  baseAmount: number;
  referredUserId: Types.ObjectId;
  sourceTransactionId: Types.ObjectId;
  balanceAfter: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TPartnerWithdrawRequest = {
  _id: Types.ObjectId;
  partnerUserId: Types.ObjectId;
  amount: number;
  status: TPartnerWithdrawStatus;
  paymentMethod: TPartnerPaymentMethod;
  walletNumber: string;
  accountHolderName: string;
  adminNote?: string;
  processedBy?: Types.ObjectId;
  processedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TPartnerCommissionSettings = {
  _id: Types.ObjectId;
  key: 'global';
  defaultCommissionRate: number;
};
