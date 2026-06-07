import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { allProviderGames } from '../data/gameData';
import { GameCatalogModel } from '../models/GameCatalogModel';
import { connectSeedDb } from './seedUtils';

dotenv.config();

const normalizeGameType = (type: string): string => {
  const lower = type.toLowerCase();
  if (lower.includes('slot')) return 'slot';
  if (lower.includes('fish')) return 'fishing';
  if (lower.includes('live') || lower.includes('casino')) return 'live';
  return 'all';
};

const seedGameCatalog = async () => {
  try {
    await connectSeedDb();

    const gameDocs = allProviderGames.flatMap(({ platform, provider, games }) => {
      console.log(`→ ${provider}: ${games.length} games`);
      return games.map((game, index) => ({
        tileId: game.game_code,
        title: game.game_name,
        providerKey: provider,
        providerLabel: provider.toUpperCase(),
        gameCode: game.game_code,
        image: game.game_image || '',
        gradient: '',
        glow: '',
        game_name: game.game_name,
        game_type: normalizeGameType(game.game_type),
        game_image: game.game_image,
        platform,
        provider,
        sortOrder: index,
      }));
    });

    let updatedCount = 0;

    for (const game of gameDocs) {
      const result = await GameCatalogModel.updateOne(
        { tileId: game.tileId },
        { $set: game },
        { upsert: true },
      );
      if (result.upsertedCount > 0 || result.modifiedCount > 0) {
        updatedCount++;
      }
    }

    console.log(`✅ Seeded or updated ${updatedCount} aggregator games into GameCatalog`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Game catalog seeding failed:', error);
    process.exit(1);
  }
};

seedGameCatalog();
