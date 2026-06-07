import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { homeGames } from '../data/homeGamesData';
import { HomeGameModel } from '../models/HomeGameModel';
import { connectSeedDb, upsertByKey } from './seedUtils';

dotenv.config();

const seedHomeGames = async () => {
  try {
    await connectSeedDb();
    const updatedCount = await upsertByKey(
      HomeGameModel as mongoose.Model<unknown>,
      'gameId',
      homeGames,
    );
    console.log(`✅ Seeded or updated ${updatedCount} home games`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Home games seeding failed:', error);
    process.exit(1);
  }
};

seedHomeGames();
