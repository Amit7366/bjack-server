import { Schema, model } from 'mongoose';

const homeGameSchema = new Schema(
  {
    gameId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    providerKey: { type: String, required: true },
    providerLabel: { type: String, required: true },
    gameCode: { type: String },
    game_type: { type: String, index: true, default: 'slot' },
    gradient: { type: String, required: true },
    glow: { type: String, required: true },
    emoji: { type: String },
    image: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

homeGameSchema.index({ sortOrder: 1 });

export const HomeGameModel = model('HomeGame', homeGameSchema);
