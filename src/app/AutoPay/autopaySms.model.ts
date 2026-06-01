import { Schema, model } from "mongoose";
import { TAutoPaySms } from "./autopaySms.interface";

const AutoPaySmsSchema = new Schema<TAutoPaySms>(
  {
    title: { type: String, required: true, trim: true },
    trxid: { type: String, required: true, trim: true, uppercase: true },
    amount: { type: Number, required: true, min: 0 },
    sender: { type: String, trim: true },
    message: { type: String, required: true },
    receivedAt: { type: Date, required: true, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "verified"],
      default: "pending",
      index: true,
    },
    matchedTransactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
      default: null,
    },
    matchedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: "autopay_sms",
  }
);

AutoPaySmsSchema.index({ trxid: 1 }, { unique: true });
AutoPaySmsSchema.index({ status: 1, trxid: 1 });
AutoPaySmsSchema.index({ createdAt: -1 });

export const AutoPaySms = model<TAutoPaySms>("AutoPaySms", AutoPaySmsSchema);
