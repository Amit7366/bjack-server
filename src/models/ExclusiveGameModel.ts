import { Schema, model } from 'mongoose';

const exclusiveGameSchema = new Schema(
  {
    image: { type: String, default: '' },
    gameId: { type: String },
    gameCode: { type: String },
    title: { type: String },
    game_type: { type: String, index: true, default: 'slot' },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

exclusiveGameSchema.index({ sortOrder: 1 });

export const ExclusiveGameModel = model('ExclusiveGame', exclusiveGameSchema);
