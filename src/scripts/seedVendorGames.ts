import dotenv from 'dotenv';
import { vendorGames } from '../data/vendorGamesData';
import { GameCatalogModel } from '../models/GameCatalogModel';
import { connectSeedDb } from './seedUtils';
import { inferGameTypeFromTitle, lobbyCatalogTypeToTurnover } from '../app/GameEligibility/gameType.util';

dotenv.config();

async function dropLegacyGameCodeIndex() {
  try {
    const indexes = await GameCatalogModel.collection.indexes();
    for (const idx of indexes) {
      const name = idx.name;
      if (name === 'game_code_1' || name === 'gameCode_1') {
        await GameCatalogModel.collection.dropIndex(name);
        console.log(`→ Dropped legacy index: ${name}`);
      }
    }
  } catch (error: unknown) {
    const mongoError = error as { code?: number; codeName?: string };
    if (mongoError.code === 26 || mongoError.codeName === 'NamespaceNotFound') {
      console.log('→ gamecatalogs collection does not exist yet, skipping index drop');
      return;
    }
    throw error;
  }
}

const seedVendorGames = async () => {
  try {
    await connectSeedDb();
    await dropLegacyGameCodeIndex();

    const ops = vendorGames.map((game) => {
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
      return {
        updateOne: {
          filter: { tileId: game.tileId },
          update: { $set: doc },
          upsert: true,
        },
      };
    });

    const BATCH = 500;
    let upserted = 0;
    let modified = 0;
    for (let i = 0; i < ops.length; i += BATCH) {
      const result = await GameCatalogModel.bulkWrite(ops.slice(i, i + BATCH), { ordered: false });
      upserted += result.upsertedCount;
      modified += result.modifiedCount;
      console.log(`→ GameCatalog ${Math.min(i + BATCH, ops.length)}/${ops.length}`);
    }

    console.log(
      `✅ Seeded or updated ${upserted + modified} vendor games into GameCatalog (${vendorGames.length} total from gameData)`,
    );
    process.exit(0);
  } catch (error) {
    console.error('❌ Vendor games seeding failed:', error);
    process.exit(1);
  }
};

seedVendorGames();
