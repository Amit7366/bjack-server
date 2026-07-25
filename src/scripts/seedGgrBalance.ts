import dotenv from 'dotenv';
import {
  GgrBalance,
  GGR_BALANCE_KEY,
  GGR_DEFAULT_TOTAL,
  GGR_DEFAULT_USED,
} from '../app/GameTxnRecords/models/GgrBalance';
import { connectSeedDb } from './seedUtils';

dotenv.config();

async function main() {
  await connectSeedDb();

  const result = await GgrBalance.updateOne(
    { key: GGR_BALANCE_KEY },
    {
      $setOnInsert: {
        key: GGR_BALANCE_KEY,
        totalGgr: GGR_DEFAULT_TOTAL,
        usedGgr: GGR_DEFAULT_USED,
      },
    },
    { upsert: true }
  );

  const doc = await GgrBalance.findOne({ key: GGR_BALANCE_KEY }).lean();
  console.log(
    result.upsertedCount
      ? `✅ Seeded ggr_balances: total=${doc?.totalGgr} used=${doc?.usedGgr}`
      : `ℹ️ ggr_balances already exists: total=${doc?.totalGgr} used=${doc?.usedGgr}`
  );
}

main()
  .catch((err) => {
    console.error('❌ seedGgrBalance failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    const mongoose = await import('mongoose');
    await mongoose.disconnect();
  });
