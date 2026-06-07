import { Schema, model } from 'mongoose';

/** Vendor lobby tile + legacy aggregator catalog fields (turnover uses gameCode / game_type). */
const gameSchema = new Schema(
  {
    tileId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    providerKey: { type: String, required: true, default: '' },
    providerLabel: { type: String, required: true, default: '' },
    gameCode: { type: String, sparse: true },
    gradient: { type: String, default: '' },
    glow: { type: String, default: '' },
    emoji: { type: String },
    image: { type: String, required: true },
    types: [{ type: String }],
    vendorCode: { type: String, index: true },
    sortOrder: { type: Number, default: 0 },

    /** Legacy aggregator catalog (gameData.ts seed) */
    game_name: { type: String },
    game_type: { type: String, index: true },
    game_image: { type: String },
    platform: { type: String },
    provider: { type: String, index: true },
  },
  { timestamps: true },
);

gameSchema.index({ vendorCode: 1, sortOrder: 1 });
gameSchema.index({ gameCode: 1 });

export const GameCatalogModel = model('GameCatalog', gameSchema);
