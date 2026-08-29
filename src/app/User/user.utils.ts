// src/User/generateId.util.ts  (or your current path)
import mongoose from 'mongoose';
import { Counter } from './counter.model';
import { User } from './user.model';

const START_USER_ID = 47000; // Starting ID

// 🔒 Use atomic counter *with the caller's session* to avoid race conditions.
//    Pass the mongoose session from createUserIntoDb:  await generateid(session)
export const generateUserId = async (session?: mongoose.ClientSession): Promise<string> => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'user' },
    { $inc: { value: 1 } },
    { new: true, upsert: true, session } // <-- session wired in
  );

  const numericId = START_USER_ID + (counter!.value - 1);
  return `rajab${numericId}`;
};

// ✅ Admin ID generation (unchanged)
export const generateAdminId = async (): Promise<string> => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'admin' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  const incrementId = counter!.value.toString().padStart(4, '0');
  return `A-${incrementId}`;
};

// ✅ Advertiser ID generation (unchanged)
export const generateAdvertiserId = async (): Promise<string> => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'advertiser' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  const incrementId = counter!.value.toString().padStart(4, '0');
  return `AD-${incrementId}`;
};

// 🧹 (Optional) If these are unused, you can safely delete them:
export const findLastAdminId = async (): Promise<string | undefined> => {
  const lastAdmin = await User.findOne(
    { role: 'admin' },
    { id: 1, _id: 0 }
  ).sort({ createdAt: -1 }).lean();

  return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
};

export const findLastAdvertiserId = async (): Promise<string | undefined> => {
  const lastAdvertiser = await User.findOne(
    { role: 'advertiser' },
    { id: 1, _id: 0 }
  ).sort({ createdAt: -1 }).lean();

  return lastAdvertiser?.id ? lastAdvertiser.id.substring(2) : undefined;
};

// ✅ Export standard (unchanged name for the rest of your code)
export { generateUserId as generateid };
