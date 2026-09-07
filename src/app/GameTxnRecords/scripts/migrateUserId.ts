import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// ✅ Load MongoDB URI
const MONGO_URI = process.env.DATABASE_URL || "mongodb://localhost:27017/betmaster24";

interface IUserBalance {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

interface IGameTxnRecord {
  _id: mongoose.Types.ObjectId;
  userBalanceId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
}

const runMigration = async (): Promise<void> => {
  console.log("🚀 Starting migration and indexing...");

  // Connect to MongoDB
  await mongoose.connect(MONGO_URI, {
    dbName: process.env.DATABASE_NAME || "banglajackpot",
  });
  console.log("✅ Connected to MongoDB");

  const db = mongoose.connection.db;
  if (!db) throw new Error("Database connection not established.");

  const gameTxnCollection = db.collection("game_txn_records");
  const userBalanceCollection = db.collection("userbalances");

  // STEP 1 — Build map of userBalanceId -> userId
  console.log("🔍 Building user balance map...");
  const userBalanceMap = new Map<string, mongoose.Types.ObjectId>();

  const userBalancesCursor = userBalanceCollection.find({}, { projection: { _id: 1, userId: 1 } });
  for await (const ub of userBalancesCursor) {
    if (ub._id && ub.userId) {
      userBalanceMap.set(ub._id.toString(), ub.userId);
    }
  }
  console.log(`✅ Loaded ${userBalanceMap.size} user balances.`);

  // STEP 2 — Migrate userId into game_txn_records
  console.log("🚀 Updating game_txn_records...");
  const cursor = gameTxnCollection.find(
    { userId: { $exists: false }, userBalanceId: { $exists: true } },
    { projection: { _id: 1, userBalanceId: 1 } }
  );

  let totalUpdated = 0;
  const bulkOps: any[] = [];

  for await (const doc of cursor) {
    const userBalanceId = doc.userBalanceId?.toString();
    const userId = userBalanceId ? userBalanceMap.get(userBalanceId) : null;

    if (userId) {
      bulkOps.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { userId } },
        },
      });
    }

    // Execute in batches of 1000
    if (bulkOps.length >= 1000) {
      await gameTxnCollection.bulkWrite(bulkOps);
      totalUpdated += bulkOps.length;
      console.log(`✅ Updated ${totalUpdated} records...`);
      bulkOps.length = 0;
    }
  }

  // Final remaining batch
  if (bulkOps.length > 0) {
    await gameTxnCollection.bulkWrite(bulkOps);
    totalUpdated += bulkOps.length;
  }
  console.log(`🎉 Migration complete! Total updated: ${totalUpdated}`);

  // STEP 3 — Create / Confirm Indexes
  console.log("⚙️ Creating indexes...");

  // ✅ Use Mongoose's internal MongoDB type for CreateIndexesOptions
  type CreateIndexesOptions = mongoose.mongo.CreateIndexesOptions;

  const indexSpecs: {
    coll: string;
    key: Record<string, 1 | -1>;
    options: CreateIndexesOptions;
  }[] = [
      { coll: "game_txn_records", key: { userId: 1, providerTsUtc: -1 }, options: { background: true, name: "userId_1_providerTsUtc_-1" } },
      { coll: "game_txn_records", key: { txnId: 1 }, options: { unique: true, background: true, name: "txnId_1" } },
      { coll: "game_txn_records", key: { sbmId: 1 }, options: { background: true, name: "sbmId_1" } },
      { coll: "game_txn_records", key: { agencyUid: 1 }, options: { background: true, name: "agencyUid_1" } },
      { coll: "game_txn_records", key: { memberAccount: 1 }, options: { background: true, name: "memberAccount_1" } },
      { coll: "game_txn_records", key: { gameUid: 1 }, options: { background: true, name: "gameUid_1" } },
      { coll: "game_txn_records", key: { providerTsUtc: -1 }, options: { background: true, name: "providerTsUtc_-1" } },
      { coll: "userbalances", key: { userId: 1 }, options: { background: true, name: "userId_1" } },
      { coll: "userbalances", key: { id: 1 }, options: { unique: true, background: true, name: "id_1" } },
      { coll: "userbalances", key: { currentBalance: 1 }, options: { background: true, name: "currentBalance_1" } },
    ];

  for (const spec of indexSpecs) {
    try {
      await db.collection(spec.coll).createIndex(spec.key, spec.options);
      console.log(`✅ Index created on ${spec.coll}: ${spec.options.name}`);
    } catch (err: any) {
      console.error(`❌ Failed to create index ${spec.options.name} on ${spec.coll}:`, err.message);
    }
  }

  await mongoose.disconnect();
  console.log("🟢 All done! MongoDB disconnected.");
};

// Run the migration
runMigration().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
