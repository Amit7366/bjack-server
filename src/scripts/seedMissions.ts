import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Mission } from '../app/Mission/mission.model';
import { connectSeedDb, upsertByKey } from './seedUtils';

dotenv.config();

function daysFromNow(days: number): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
}

function dayRange(startOffset: number, endOffset: number) {
  const startsAt = daysFromNow(startOffset);
  const endsAt = daysFromNow(endOffset);
  endsAt.setHours(23, 59, 59, 999);
  return { startsAt, endsAt };
}

const RUNNING_MISSIONS = [
  {
    slug: 'daily-slot-betting-bonus',
    title: {
      en: 'Daily Slot Betting Bonus Mission',
      bn: 'প্রতিদিন স্লট বাজির বোনাস মিশন',
      hi: 'दैनिक स्लॉट बेटिंग बोनस मिशन',
    },
    rules: {
      en: 'Place slot bets every day during the event period to complete daily targets and earn bonus rewards.',
      bn: 'ইভেন্ট চলাকালীন প্রতিদিন স্লট বাজি করুন, লক্ষ্য পূরণ করুন এবং বোনাস পুরস্কার জিতুন।',
      hi: 'इवेंट अवधि के दौरान हर दिन स्लॉट बेट लगाएं, लक्ष्य पूरा करें और बोनस पुरस्कार जीतें।',
    },
    ...dayRange(-1, 1),
    targetValue: 26,
    medalType: 'bronze',
    sortOrder: 1,
    isActive: true,
  },
  {
    slug: 'free-spin-jili-reward',
    title: {
      en: 'Free Spin JILI Reward Mission',
      bn: 'ফ্রি স্পিন JILI পুরস্কার মিশন',
      hi: 'फ्री स्पिन JILI रिवॉर्ड मिशन',
    },
    rules: {
      en: 'Play JILI slot games and collect free spin rewards when you reach the mission target.',
      bn: 'JILI স্লট গেম খেলুন এবং মিশন লক্ষ্যে পৌঁছালে ফ্রি স্পিন পুরস্কার সংগ্রহ করুন।',
      hi: 'JILI स्लॉट गेम खेलें और मिशन लक्ष्य पूरा करने पर फ्री स्पिन पुरस्कार प्राप्त करें।',
    },
    ...dayRange(-1, 0),
    targetValue: 3,
    medalType: 'bronze',
    sortOrder: 2,
    isActive: true,
  },
  {
    slug: 'cricket-quest-mission',
    title: {
      en: 'Cricket Quest Mission',
      bn: 'ক্রিকেট কোয়েস্ট মিশন',
      hi: 'क्रिकेट क्वेस्ट मिशन',
    },
    rules: {
      en: 'Bet on cricket matches during the event and complete the required number of valid bets.',
      bn: 'ইভেন্ট চলাকালীন ক্রিকেট ম্যাচে বাজি ধরুন এবং প্রয়োজনীয় বৈধ বাজি সম্পন্ন করুন।',
      hi: 'इवेंट के दौरान क्रिकेट मैचों पर बेट लगाएं और आवश्यक वैध बेट पूरी करें।',
    },
    ...dayRange(-2, 2),
    targetValue: 10,
    medalType: 'bronze',
    sortOrder: 3,
    isActive: true,
  },
];

const COMING_SOON_TITLES = [
  {
    en: 'Weekend Slot Challenge',
    bn: 'সপ্তাহান্ত স্লট চ্যালেঞ্জ',
    hi: 'वीकेंड स्लॉट चैलेंज',
  },
  {
    en: 'Fishing Master Mission',
    bn: 'ফিশিং মাস্টার মিশন',
    hi: 'फिशिंग मास्टर मिशन',
  },
  {
    en: 'Live Casino Streak',
    bn: 'লাইভ ক্যাসিনো স্ট্রিক',
    hi: 'लाइव कैसीनो स्ट्रीक',
  },
  {
    en: 'Sports Parlay Quest',
    bn: 'স্পোর্টস পার্লে কোয়েস্ট',
    hi: 'स्पोर्ट्स पार्ले क्वेस्ट',
  },
  {
    en: 'Deposit Boost Mission',
    bn: 'ডিপোজিট বুস্ট মিশন',
    hi: 'डिपॉजिट बूस्ट मिशन',
  },
  {
    en: 'VIP Upgrade Challenge',
    bn: 'ভিআইপি আপগ্রেড চ্যালেঞ্জ',
    hi: 'VIP अपग्रेड चैलेंज',
  },
  {
    en: 'Aviator High Flyer',
    bn: 'এভিয়েটর হাই ফ্লায়ার',
    hi: 'एविएटर हाई फ्लायर',
  },
  {
    en: 'Poker Night Mission',
    bn: 'পোকার নাইট মিশন',
    hi: 'पोकर नाइट मिशन',
  },
  {
    en: 'Mega Spin Festival',
    bn: 'মেগা স্পিন ফেস্টিভাল',
    hi: 'मेगा स्पिन फेस्टिवल',
  },
  {
    en: 'Referral Rush Mission',
    bn: 'রেফারেল রাশ মিশন',
    hi: 'रेफरल रश मिशन',
  },
  {
    en: 'Loss Recovery Quest',
    bn: 'লস রিকভারি কোয়েস্ট',
    hi: 'लॉस रिकवरी क्वेस्ट',
  },
  {
    en: 'New Game Explorer',
    bn: 'নতুন গেম এক্সপ্লোরার',
    hi: 'नया गेम एक्सप्लोरर',
  },
];

const COMING_SOON_MISSIONS = COMING_SOON_TITLES.map((title, index) => {
  const startOffset = index + 1;
  const endOffset = startOffset + 1;
  const slug = `coming-soon-${index + 1}`;

  return {
    slug,
    title,
    rules: {
      en: 'This mission will open soon. Check back when the event starts to participate and earn rewards.',
      bn: 'এই মিশন শীঘ্রই শুরু হবে। ইভেন্ট শুরু হলে অংশগ্রহণ করুন এবং পুরস্কার জিতুন।',
      hi: 'यह मिशन जल्द शुरू होगा। इवेंट शुरू होने पर भाग लें और पुरस्कार जीतें।',
    },
    ...dayRange(startOffset, endOffset),
    targetValue: [5, 8, 12, 15, 20, 3, 7, 9, 11, 4, 6, 10][index] ?? 5,
    medalType: 'bronze' as const,
    sortOrder: 100 + index,
    isActive: true,
  };
});

const CLOSED_TITLES = [
  { en: 'Spring Slot Carnival', bn: 'বসন্ত স্লট কার্নিভাল', hi: 'वसंत स्लॉट कार्निवल' },
  { en: 'Eid Special Mission', bn: 'ঈদ বিশেষ মিশন', hi: 'ईद विशेष मिशन' },
  { en: 'Summer Sports Fest', bn: 'গ্রীষ্মকালীন স্পোর্টস ফেস্ট', hi: 'ग्रीष्मकालीन स्पोर्ट्स फेस्ट' },
  { en: 'Lucky Wheel Quest', bn: 'লাকি হুইল কোয়েস্ট', hi: 'लकी व्हील क्वेस्ट' },
  { en: 'Daily Login Streak', bn: 'দৈনিক লগইন স্ট্রিক', hi: 'दैनिक लॉगिन स्ट्रीक' },
  { en: 'Table Game Master', bn: 'টেবিল গেম মাস্টার', hi: 'टेबल गेम मास्टर' },
  { en: 'Jackpot Hunter', bn: 'জ্যাকপট হান্টার', hi: 'जैकपॉट हंटर' },
  { en: 'Fast Bet Challenge', bn: 'ফাস্ট বেট চ্যালেঞ্জ', hi: 'फास्ट बेट चैलेंज' },
  { en: 'Night Owl Bonus', bn: 'নাইট আউল বোনাস', hi: 'नाइट आउल बोनस' },
  { en: 'Friend Invite Sprint', bn: 'বন্ধু আমন্ত্রণ স্প্রিন্ট', hi: 'मित्र आमंत्रण स्प्रिंट' },
  { en: 'Cashback King Mission', bn: 'ক্যাশব্যাক কিং মিশন', hi: 'कैशबैक किंग मिशन' },
  { en: 'Slot Tournament', bn: 'স্লট টুর্নামেন্ট', hi: 'स्लॉट टूर्नामेंट' },
  { en: 'Fishing Jackpot Quest', bn: 'ফিশিং জ্যাকপট কোয়েস্ট', hi: 'फिशिंग जैकपॉट क्वेस्ट' },
  { en: 'Cricket World Cup Mission', bn: 'ক্রিকেট ওয়ার্ল্ড কাপ মিশন', hi: 'क्रिकेट वर्ल्ड कप मिशन' },
  { en: 'Mega Deposit Bonus', bn: 'মেগা ডিপোজিট বোনাস', hi: 'मेगा डिपॉजिट बोनस' },
];

const CLOSED_MISSIONS = CLOSED_TITLES.map((title, index) => {
  const endOffset = -(index + 1);
  const startOffset = endOffset - 1;
  const slug = `closed-${index + 1}`;

  return {
    slug,
    title,
    rules: {
      en: 'This mission has ended. Rewards were available only during the active event period.',
      bn: 'এই মিশন শেষ হয়েছে। পুরস্কার শুধুমাত্র সক্রিয় ইভেন্ট সময়ে পাওয়া যেত।',
      hi: 'यह मिशन समाप्त हो गया है। पुरस्कार केवल सक्रिय इवेंट अवधि के दौरान उपलब्ध थे।',
    },
    ...dayRange(startOffset, endOffset),
    targetValue: [26, 3, 15, 8, 7, 12, 5, 9, 6, 4, 10, 20, 11, 14, 18][index] ?? 5,
    medalType: 'silver' as const,
    sortOrder: 200 + index,
    isActive: true,
  };
});

const ALL_MISSIONS = [...RUNNING_MISSIONS, ...COMING_SOON_MISSIONS, ...CLOSED_MISSIONS];

async function seedMissions(): Promise<void> {
  await connectSeedDb();

  const updated = await upsertByKey(Mission as mongoose.Model<unknown>, 'slug', ALL_MISSIONS);
  console.log(`✅ Seeded ${updated} missions (${RUNNING_MISSIONS.length} running, ${COMING_SOON_MISSIONS.length} coming soon, ${CLOSED_MISSIONS.length} closed)`);

  await mongoose.disconnect();
}

seedMissions().catch((error) => {
  console.error('❌ Mission seed failed:', error);
  process.exit(1);
});
