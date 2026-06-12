import dotenv from 'dotenv';
import { GameCatalogModel } from '../models/GameCatalogModel';
import { HomeGameModel } from '../models/HomeGameModel';
import { ExclusiveGameModel } from '../models/ExclusiveGameModel';
import { homeGames } from '../data/homeGamesData';
import { exclusiveGames } from '../data/exclusiveGamesData';
import { connectSeedDb } from './seedUtils';
import { inferGameTypeFromTitle, normalizeTurnoverGameType } from '../app/GameEligibility/gameType.util';

dotenv.config();

async function backfillCatalogMissingTypes() {
  const rows = await GameCatalogModel.find({
    $or: [{ game_type: { $exists: false } }, { game_type: '' }, { game_type: null }],
  })
    .select('tileId title vendorCode providerKey types')
    .lean();

  let updated = 0;
  for (const row of rows) {
    const fromTypes = row.types?.[0];
    const gameType = normalizeTurnoverGameType(
      fromTypes
        ? String(fromTypes)
        : inferGameTypeFromTitle(String(row.title ?? ''), String(row.vendorCode ?? row.providerKey ?? ''))
    );

    await GameCatalogModel.updateOne({ _id: row._id }, { $set: { game_type: gameType } });
    updated++;
  }
  return updated;
}

const seedGameTypes = async () => {
  try {
    await connectSeedDb();

    let homeUpdated = 0;
    for (const game of homeGames) {
      const result = await HomeGameModel.updateOne(
        { gameId: game.gameId },
        { $set: { game_type: game.game_type } },
        { upsert: false }
      );
      if (result.modifiedCount > 0) homeUpdated++;
    }

    let exclusiveUpdated = 0;
    for (const game of exclusiveGames) {
      if (!game.gameCode) continue;
      const result = await ExclusiveGameModel.updateMany(
        { gameCode: game.gameCode },
        { $set: { game_type: game.game_type ?? 'slot', gameId: game.gameId } }
      );
      exclusiveUpdated += result.modifiedCount;
    }

    const catalogUpdated = await backfillCatalogMissingTypes();

    console.log(`✅ Home games game_type updated: ${homeUpdated}`);
    console.log(`✅ Exclusive games game_type updated: ${exclusiveUpdated}`);
    console.log(`✅ GameCatalog backfilled: ${catalogUpdated}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Game type seeding failed:', error);
    process.exit(1);
  }
};

seedGameTypes();
