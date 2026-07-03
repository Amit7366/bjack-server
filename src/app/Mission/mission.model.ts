import { Schema, model } from 'mongoose';

export type MissionMedalType = 'bronze' | 'silver';

export interface IMission {
  slug: string;
  title: {
    en: string;
    bn: string;
    hi: string;
  };
  rules: {
    en: string;
    bn: string;
    hi: string;
  };
  startsAt: Date;
  endsAt: Date;
  targetValue: number;
  medalType: MissionMedalType;
  sortOrder: number;
  isActive: boolean;
}

const missionSchema = new Schema<IMission>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: {
      en: { type: String, required: true },
      bn: { type: String, required: true },
      hi: { type: String, required: true },
    },
    rules: {
      en: { type: String, required: true },
      bn: { type: String, required: true },
      hi: { type: String, required: true },
    },
    startsAt: { type: Date, required: true, index: true },
    endsAt: { type: Date, required: true, index: true },
    targetValue: { type: Number, required: true, min: 1 },
    medalType: { type: String, enum: ['bronze', 'silver'], default: 'bronze' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

missionSchema.index({ isActive: 1, startsAt: 1, endsAt: 1 });

export const Mission = model<IMission>('Mission', missionSchema);
