import { Schema, model } from 'mongoose';
import { TPartnerCommissionSettings } from './partnerCommission.interface';

const partnerCommissionSettingsSchema = new Schema<TPartnerCommissionSettings>(
  {
    key: {
      type: String,
      enum: ['global'],
      required: true,
      unique: true,
      default: 'global',
    },
    defaultCommissionRate: {
      type: Number,
      required: true,
      default: 0.35,
      min: 0,
      max: 1,
    },
  },
  { timestamps: true },
);

export const PartnerCommissionSettings = model<TPartnerCommissionSettings>(
  'PartnerCommissionSettings',
  partnerCommissionSettingsSchema,
);
