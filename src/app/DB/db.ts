// src/config/db.ts
import mongoose from 'mongoose';
import config from '../config';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const connectDB = async () => {
  try {
    console.log('🧪 Connecting to MongoDB at:', config.database_url);

    await mongoose.connect(config.database_url as string, {
      dbName: config.database_name,
      serverSelectionTimeoutMS: 20000, // wait 20s for Atlas to respond
      socketTimeoutMS: 45000,
    });

    // wait until DB is ready
    await mongoose.connection.asPromise();

    console.log('✅ MongoDB connected from worker');
  } catch (error) {
    console.error('❌ MongoDB connection failed in worker:', error);
    process.exit(1);
  }
};
