import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserBalance } from '../userBalance.model';


dotenv.config();

const MONGO_URI = process.env.DATABASE_URL;

async function addStoreDbBalanceField() {
  try {
    if (!MONGO_URI) throw new Error('Missing DATABASE_URL in .env');
    await mongoose.connect(MONGO_URI, {
      dbName: process.env.DATABASE_NAME || 'banglajackpot',
    });
    console.log('✅ Connected to MongoDB Atlas');

    const result = await UserBalance.updateMany(
      { storeDbBalance: { $exists: false } },
      { $set: { storeDbBalance: 0 } }
    );

    console.log(`🟢 Updated ${result.modifiedCount} user balances`);
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔒 Disconnected from MongoDB');
  }
}

addStoreDbBalanceField();
