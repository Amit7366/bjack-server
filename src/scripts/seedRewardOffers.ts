import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { RewardOffer } from '../app/RewardOffer/rewardOffer.model';
import { connectSeedDb, upsertByKey } from './seedUtils';

dotenv.config();

const REWARD_OFFERS = [
  {
    slug: 'member-bonus-10',
    title: {
      en: 'Member Bonus ৳10',
      bn: 'মেম্বার বোনাস ৳১০',
      hi: 'सदस्य बोनस ৳10',
    },
    description: {
      en: 'Claim ৳10 every 15 days (1× turnover)',
      bn: 'প্রতি ১৫ দিনে ৳১০ ক্লেইম (১× টার্নওভার)',
      hi: 'हर 15 दिन में ৳10 क्लेम (1× टर्नओवर)',
    },
    bonusAmount: 10,
    turnoverMultiplier: 1,
    cooldownHours: 360,
    criteriaType: 'none',
    criteriaValue: 0,
    sortOrder: 1,
    isActive: true,
  },
  {
    slug: 'daily-login-5',
    title: {
      en: 'Daily Login Bonus',
      bn: 'দৈনিক লগইন বোনাস',
      hi: 'दैनिक लॉगिन बोनस',
    },
    description: {
      en: 'Claim ৳5 every 24 hours',
      bn: 'প্রতি ২৪ ঘণ্টায় ৳৫ ক্লেইম',
      hi: 'हर 24 घंटे में ৳5 क्लेम',
    },
    bonusAmount: 5,
    turnoverMultiplier: 1,
    cooldownHours: 24,
    criteriaType: 'none',
    criteriaValue: 0,
    sortOrder: 2,
    isActive: true,
  },
  {
    slug: 'daily-deposit-100',
    title: {
      en: 'Daily Deposit ৳100',
      bn: 'দৈনিক ডিপোজিট ৳১০০',
      hi: 'दैनिक जमा ৳100',
    },
    description: {
      en: 'Deposit ৳100 today to claim ৳15',
      bn: 'আজ ৳১০০ ডিপোজিট করে ৳১৫ ক্লেইম করুন',
      hi: 'आज ৳100 जमा करके ৳15 क्लेम करें',
    },
    bonusAmount: 15,
    turnoverMultiplier: 1,
    cooldownHours: 24,
    criteriaType: 'daily_deposit',
    criteriaValue: 100,
    sortOrder: 3,
    isActive: true,
  },
  {
    slug: 'daily-deposit-300',
    title: {
      en: 'Daily Deposit ৳300',
      bn: 'দৈনিক ডিপোজিট ৳৩০০',
      hi: 'दैनिक जमा ৳300',
    },
    description: {
      en: 'Deposit ৳300 today to claim ৳50',
      bn: 'আজ ৳৩০০ ডিপোজিট করে ৳৫০ ক্লেইম করুন',
      hi: 'आज ৳300 जमा करके ৳50 क्लेम करें',
    },
    bonusAmount: 50,
    turnoverMultiplier: 1,
    cooldownHours: 24,
    criteriaType: 'daily_deposit',
    criteriaValue: 300,
    sortOrder: 4,
    isActive: true,
  },
  {
    slug: 'daily-deposit-1000',
    title: {
      en: 'Daily Deposit ৳1000',
      bn: 'দৈনিক ডিপোজিট ৳১০০০',
      hi: 'दैनिक जमा ৳1000',
    },
    description: {
      en: 'Deposit ৳1000 today to claim ৳150',
      bn: 'আজ ৳১০০০ ডিপোজিট করে ৳১৫০ ক্লেইম করুন',
      hi: 'आज ৳1000 जमा करके ৳150 क्लेम करें',
    },
    bonusAmount: 150,
    turnoverMultiplier: 1,
    cooldownHours: 24,
    criteriaType: 'daily_deposit',
    criteriaValue: 1000,
    sortOrder: 5,
    isActive: true,
  },
  {
    slug: 'weekend-bonus-20',
    title: {
      en: 'Weekend Bonus',
      bn: 'সাপ্তাহিক ছুটির বোনাস',
      hi: 'सप्ताहांत बोनस',
    },
    description: {
      en: 'Claim ৳20 every 3 days',
      bn: 'প্রতি ৩ দিনে ৳২০ ক্লেইম',
      hi: 'हर 3 दिन में ৳20 क्लेम',
    },
    bonusAmount: 20,
    turnoverMultiplier: 1,
    cooldownHours: 72,
    criteriaType: 'none',
    criteriaValue: 0,
    sortOrder: 6,
    isActive: true,
  },
  {
    slug: 'loyalty-bonus-12',
    title: {
      en: 'Loyalty Bonus',
      bn: 'লয়্যালটি বোনাস',
      hi: 'लॉयल्टी बोनस',
    },
    description: {
      en: 'Claim ৳12 every 3 days',
      bn: 'প্রতি ৩ দিনে ৳১২ ক্লেইম',
      hi: 'हर 3 दिन में ৳12 क्लेम',
    },
    bonusAmount: 12,
    turnoverMultiplier: 1,
    cooldownHours: 72,
    criteriaType: 'none',
    criteriaValue: 0,
    sortOrder: 7,
    isActive: true,
  },
  {
    slug: 'weekly-bonus-25',
    title: {
      en: 'Weekly Bonus',
      bn: 'সাপ্তাহিক বোনাস',
      hi: 'साप्ताहिक बोनस',
    },
    description: {
      en: 'Claim ৳25 every 7 days',
      bn: 'প্রতি ৭ দিনে ৳২৫ ক্লেইম',
      hi: 'हर 7 दिन में ৳25 क्लेम',
    },
    bonusAmount: 25,
    turnoverMultiplier: 1,
    cooldownHours: 168,
    criteriaType: 'none',
    criteriaValue: 0,
    sortOrder: 8,
    isActive: true,
  },
  {
    slug: 'biweekly-bonus-40',
    title: {
      en: 'Bi-weekly Bonus',
      bn: 'পাক্ষিক বোনাস',
      hi: 'पाक्षिक बोनस',
    },
    description: {
      en: 'Claim ৳40 every 15 days',
      bn: 'প্রতি ১৫ দিনে ৳৪০ ক্লেইম',
      hi: 'हर 15 दिन में ৳40 क्लेम',
    },
    bonusAmount: 40,
    turnoverMultiplier: 1,
    cooldownHours: 360,
    criteriaType: 'none',
    criteriaValue: 0,
    sortOrder: 9,
    isActive: true,
  },
  {
    slug: 'refer-1-friend',
    title: {
      en: 'Refer 1 Friend',
      bn: '১ জন বন্ধুকে রেফার করুন',
      hi: '1 मित्र को रेफर करें',
    },
    description: {
      en: 'Refer at least 1 friend to claim ৳100',
      bn: 'কমপক্ষে ১ জন বন্ধুকে রেফার করে ৳১০০ ক্লেইম করুন',
      hi: 'कम से कम 1 मित्र रेफर करके ৳100 क्लेम करें',
    },
    bonusAmount: 100,
    turnoverMultiplier: 1,
    cooldownHours: 168,
    criteriaType: 'referral',
    criteriaValue: 1,
    sortOrder: 10,
    isActive: true,
  },
  {
    slug: 'refer-3-friends',
    title: {
      en: 'Refer 3 Friends',
      bn: '৩ জন বন্ধুকে রেফার করুন',
      hi: '3 मित्रों को रेफर करें',
    },
    description: {
      en: 'Refer at least 3 friends to claim ৳300',
      bn: 'কমপক্ষে ৩ জন বন্ধুকে রেফার করে ৳৩০০ ক্লেইম করুন',
      hi: 'कम से कम 3 मित्र रेफर करके ৳300 क्लेम करें',
    },
    bonusAmount: 300,
    turnoverMultiplier: 1,
    cooldownHours: 168,
    criteriaType: 'referral',
    criteriaValue: 3,
    sortOrder: 11,
    isActive: true,
  },
  {
    slug: 'refer-5-friends',
    title: {
      en: 'Refer 5 Friends',
      bn: '৫ জন বন্ধুকে রেফার করুন',
      hi: '5 मित्रों को रेफर करें',
    },
    description: {
      en: 'Refer at least 5 friends to claim ৳500',
      bn: 'কমপক্ষে ৫ জন বন্ধুকে রেফার করে ৳৫০০ ক্লেইম করুন',
      hi: 'कम से कम 5 मित्र रेफर करके ৳500 क्लेम करें',
    },
    bonusAmount: 500,
    turnoverMultiplier: 1,
    cooldownHours: 360,
    criteriaType: 'referral',
    criteriaValue: 5,
    sortOrder: 12,
    isActive: true,
  },
  {
    slug: 'first-week-500',
    title: {
      en: 'First Week Bonus',
      bn: 'প্রথম সপ্তাহের বোনাস',
      hi: 'पहले सप्ताह का बोनस',
    },
    description: {
      en: 'Total deposit ৳500+ to claim ৳30',
      bn: 'মোট ৳৫০০+ ডিপোজিট করে ৳৩০ ক্লেইম করুন',
      hi: 'कुल ৳500+ जमा करके ৳30 क्लेम करें',
    },
    bonusAmount: 30,
    turnoverMultiplier: 1,
    cooldownHours: 72,
    criteriaType: 'total_deposit',
    criteriaValue: 500,
    sortOrder: 13,
    isActive: true,
  },
  {
    slug: 'high-roller-5000',
    title: {
      en: 'High Roller Bonus',
      bn: 'হাই রোলার বোনাস',
      hi: 'हाई रोलर बोनस',
    },
    description: {
      en: 'Total deposit ৳5000+ to claim ৳200',
      bn: 'মোট ৳৫০০০+ ডিপোজিট করে ৳২০০ ক্লেইম করুন',
      hi: 'कुल ৳5000+ जमा करके ৳200 क्लेम करें',
    },
    bonusAmount: 200,
    turnoverMultiplier: 1,
    cooldownHours: 168,
    criteriaType: 'total_deposit',
    criteriaValue: 5000,
    sortOrder: 14,
    isActive: true,
  },
  {
    slug: 'mega-daily-1000',
    title: {
      en: 'Mega Daily Bonus',
      bn: 'মেগা দৈনিক বোনাস',
      hi: 'मेगा दैनिक बोनस',
    },
    description: {
      en: 'Deposit ৳1000 today to claim ৳77',
      bn: 'আজ ৳১০০০ ডিপোজিট করে ৳৭৭ ক্লেইম করুন',
      hi: 'आज ৳1000 जमा करके ৳77 क्लेम करें',
    },
    bonusAmount: 77,
    turnoverMultiplier: 1,
    cooldownHours: 24,
    criteriaType: 'daily_deposit',
    criteriaValue: 1000,
    sortOrder: 15,
    isActive: true,
  },
];

async function main() {
  await connectSeedDb();
  const count = await upsertByKey(
    RewardOffer as mongoose.Model<unknown>,
    'slug',
    REWARD_OFFERS,
  );
  console.log(`✅ Seeded ${count} reward offers (${REWARD_OFFERS.length} total definitions)`);
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ seedRewardOffers failed:', err);
  process.exit(1);
});
