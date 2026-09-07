import mongoose from "mongoose";
import dotenv from "dotenv";
import { UserBalance } from "../userBalance.model";

dotenv.config();

const MONGO_URI = process.env.DATABASE_URL;

async function addSpinFields() {
  try {
    if (!MONGO_URI) throw new Error("Missing DATABASE_URL in .env");

    await mongoose.connect(MONGO_URI, {
      dbName: process.env.DATABASE_NAME || "banglajackpot",
    });
    console.log("✅ Connected to MongoDB Atlas");

    /**
     * ✅ Only update docs that don't have these fields yet
     * This is safe to run multiple times.
     */
    const result = await UserBalance.updateMany(
      {
        $or: [
          { lastSpinAt: { $exists: false } },
          { nextSpinAt: { $exists: false } },
          { lastSpinAmount: { $exists: false } },
          { totalSpinWon: { $exists: false } },
        ],
      },
      {
        $set: {
          lastSpinAt: null,
          nextSpinAt: null,
          lastSpinAmount: 0,
          totalSpinWon: 0,
        },
      }
    );

    console.log(`🟢 Matched ${result.matchedCount} | Updated ${result.modifiedCount} user balances`);
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔒 Disconnected from MongoDB");
  }
}

addSpinFields();
