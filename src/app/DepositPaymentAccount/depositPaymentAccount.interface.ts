import { Model, Types } from 'mongoose';
import { TPaymentMethod } from './depositPaymentAccount.constant';

export type TDepositPaymentAccount = {
  _id?: Types.ObjectId;
  paymentMethod: TPaymentMethod;
  channelId: string;
  channelName: string;
  accountNumber: string;
  accountHolderName?: string;
  recommended?: boolean;
  isEnabled: boolean;
  isActive: boolean;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface DepositPaymentAccountModel extends Model<TDepositPaymentAccount> {}
