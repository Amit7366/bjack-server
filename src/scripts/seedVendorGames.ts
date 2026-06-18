import dotenv from 'dotenv';
import { vendorGames } from '../data/vendorGamesData';
import { GameCatalogModel } from '../models/GameCatalogModel';
import { connectSeedDb } from './seedUtils';
import { inferGameTypeFromTitle, lobbyCatalogTypeToTurnover } from '../app/GameEligibility/gameType.util';

dotenv.config();

async function dropLegacyGameCodeIndex() {
  const indexes = await GameCatalogModel.collection.indexes();
  for (const idx of indexes) {
    const name = idx.name;
    if (name === 'game_code_1' || name === 'gameCode_1') {
      await GameCatalogModel.collection.dropIndex(name);
      console.log(`→ Dropped legacy index: ${name}`);
    }
  }
}

const seedVendorGames = async () => {
  try {
    await connectSeedDb();
    await dropLegacyGameCodeIndex();
    let updatedCount = 0;

    for (const game of vendorGames) {
      const lobbyType = game.types[0] ?? inferGameTypeFromTitle(game.title, game.vendorCode);
      const gameType = lobbyCatalogTypeToTurnover(lobbyType);

      const doc: Record<string, unknown> = {
        tileId: game.tileId,
        title: game.title,
        providerKey: game.providerKey,
        providerLabel: game.providerLabel,
        gradient: game.gradient,
        glow: game.glow,
        image: game.image,
        types: game.types,
        vendorCode: game.vendorCode,
        sortOrder: game.sortOrder,
        game_name: game.title,
        game_image: game.image,
        game_type: gameType,
        gameCode: game.gameCode,
        provider: game.providerKey,
      };

      if (game.emoji) {
        doc.emoji = game.emoji;
      }

      const result = await GameCatalogModel.updateOne(
        { tileId: game.tileId },
        { $set: doc },
        { upsert: true },
      );
      if (result.upsertedCount > 0 || result.modifiedCount > 0) {
        updatedCount++;
      }
    }

    console.log(`✅ Seeded or updated ${updatedCount} vendor games into GameCatalog (${vendorGames.length} total from gameData)`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Vendor games seeding failed:', error);
    process.exit(1);
  }
};

seedVendorGames();
