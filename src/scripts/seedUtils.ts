import mongoose from 'mongoose';

export async function connectSeedDb(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set');
  }
  await mongoose.connect(url);
  console.log('✅ Connected to MongoDB');
}

export async function upsertByKey(
  model: mongoose.Model<unknown>,
  filterKey: string,
  docs: Record<string, unknown>[],
): Promise<number> {
  let updatedCount = 0;
  for (const doc of docs) {
    const filter = { [filterKey]: doc[filterKey] };
    const result = await model.updateOne(filter, { $set: doc }, { upsert: true });
    if (result.upsertedCount > 0 || result.modifiedCount > 0) {
      updatedCount++;
    }
  }
  return updatedCount;
}
