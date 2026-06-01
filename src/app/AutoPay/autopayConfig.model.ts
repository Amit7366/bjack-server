import { Schema, model } from "mongoose";
import { TAutoPayConfig } from "./autopayConfig.interface";

const AutoPayConfigSchema = new Schema<TAutoPayConfig>(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    appWebhookUrl: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    collection: "autopay_config",
  }
);

export const AutoPayConfig = model<TAutoPayConfig>(
  "AutoPayConfig",
  AutoPayConfigSchema
);
