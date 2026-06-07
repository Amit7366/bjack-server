import { Schema, model } from 'mongoose';

const exclusiveGameSchema = new Schema(
  {
    image: { type: String, required: true },
    gameId: { type: String },
    gameCode: { type: String },
    title: { type: String },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

exclusiveGameSchema.index({ sortOrder: 1 });

export const ExclusiveGameModel = model('ExclusiveGame', exclusiveGameSchema);
