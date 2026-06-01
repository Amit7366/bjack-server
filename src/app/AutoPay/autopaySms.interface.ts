import { Types } from "mongoose";

export type AutoPaySmsStatus = "pending" | "verified";

export type TAutoPaySms = {
  title: string;
  trxid: string;
  amount: number;
  sender?: string;
  message: string;
  receivedAt: Date;
  status: AutoPaySmsStatus;
  matchedTransactionId?: Types.ObjectId;
  matchedAt?: Date;
};
