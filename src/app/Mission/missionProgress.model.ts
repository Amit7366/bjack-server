import { Schema, model, Types } from 'mongoose';

export interface IMissionProgress {
  userId: Types.ObjectId;
  missionSlug: string;
  currentValue: number;
}

const missionProgressSchema = new Schema<IMissionProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    missionSlug: { type: String, required: true, index: true },
    currentValue: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

missionProgressSchema.index({ userId: 1, missionSlug: 1 }, { unique: true });

export const MissionProgress = model<IMissionProgress>('MissionProgress', missionProgressSchema);
