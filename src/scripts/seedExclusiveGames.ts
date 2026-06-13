import dotenv from 'dotenv';
import { exclusiveGames } from '../data/exclusiveGamesData';
import { ExclusiveGameModel } from '../models/ExclusiveGameModel';
import { connectSeedDb, upsertByKey } from './seedUtils';

dotenv.config();

const seedExclusiveGames = async () => {
  try {
    await connectSeedDb();
    let updatedCount = 0;
    for (const doc of exclusiveGames) {
      const result = await ExclusiveGameModel.updateOne(
        { sortOrder: doc.sortOrder },
        { $set: doc },
        { upsert: true },
      );
      if (result.upsertedCount > 0 || result.modifiedCount > 0) {
        updatedCount++;
      }
    }
    console.log(`✅ Seeded or updated ${updatedCount} exclusive carousel slides (${exclusiveGames.length} total from gameData)`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Exclusive games seeding failed:', error);
    process.exit(1);
  }
};

seedExclusiveGames();
