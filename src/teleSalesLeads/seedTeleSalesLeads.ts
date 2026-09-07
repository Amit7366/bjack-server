import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { TeleSalesLeadsModel } from './teleSalesLeads.model';
import { teleSalesLeadsData } from './teleSalesLeads.data';

dotenv.config();

const seedTeleSalesLeads = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL!, {
      dbName: process.env.DATABASE_NAME || 'banglajackpot',
    });
    console.log('✅ Connected to MongoDB');

    // Clear old data (optional)
    await TeleSalesLeadsModel.deleteMany({});
    console.log('🧹 Old TeleSalesLeads removed');

    // Insert all records
    const result = await TeleSalesLeadsModel.insertMany(teleSalesLeadsData, { ordered: false });
    console.log(`✅ Inserted ${result.length} TeleSalesLeads`);

    process.exit(0);
  } catch (error) {
    console.error('❌ TeleSalesLeads seeding failed:', error);
    process.exit(1);
  }
};

seedTeleSalesLeads();
