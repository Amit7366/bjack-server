// transaction.service.ts
import { Transaction } from './transaction.model';
import { ITransaction } from './transaction.interface';
import { v4 as uuidv4 } from 'uuid';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import { UserBalance } from './userBalance.model';
import { UserOffer } from '../UserOffer/userOffer.model';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { NormalUser } from '../NormalUser/normalUser.model';
import { User } from '../User/user.model';
import { determineUserLevel } from './userLevel.util';
import { PromotionService } from '../UserPromotion/userPromotion.service';
import { TurnoverTracking } from '../UserPromotion/turnoverTracking.model';
import { SignupBonusTracking } from '../User/signupBonusTracking.model';
import { LoginBonusTracking } from '../User/loginBonusTracking.model';
import { ReferralRewardModel } from '../ReferralRewardTracker/referralReward.model';
import { ReferralModel } from '../Referral/referral.model';
import { Types } from 'mongoose';
import { GameTxnRecord } from '../GameTxnRecords/models/GameTxnRecord';
import { GameTxnRecordBackup } from '../GameTxnRecords/models/gameTxnRecordBackup.model';
import { AutoPaySms } from '../AutoPay/autopaySms.model';
import { findPromotionByCode } from '../Promotion/promotion.constant';
import {
  smsMatchesPaymentMethod,
  type AutoPayPaymentMethod,
} from '../AutoPay/matchPaymentProvider';

// dayjs tz setup (needed for .tz(...) usage)
dayjs.extend(utc);
dayjs.extend(timezone);

const validateUserWithdrawal = async (userId: string, amount: number) => {
  // ✅ 0. Minimum/Maximum rules
  if (amount < 500) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Minimum withdrawal is 500 TK.');
  }
  if (amount > 300000) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Maximum withdrawal is 300,000 TK.');
  }

  // ✅ 1. Deposit Promotion Turnover
  const pendingTurnover = await TurnoverTracking.findOne({
    userId,
    isCompleted: false,
  });

  if (pendingTurnover && typeof pendingTurnover.turnoverRequired === 'number') {
    const remaining = Math.max(
      0,
      pendingTurnover.turnoverRequired - pendingTurnover.turnoverCompleted
    );
    if (remaining > 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Withdrawal blocked: You must complete deposit bonus turnover of ${remaining} TK.`
      );
    }
  }

  // ✅ 2. Signup Bonus Turnover
  const signupBonus = await SignupBonusTracking.findOne({
    userId,
    isCompleted: false,
  });

  if (signupBonus && typeof signupBonus.turnoverRequired === 'number') {
    const remaining = Math.max(
      0,
      signupBonus.turnoverRequired - signupBonus.turnoverCompleted
    );
    if (remaining > 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Withdrawal blocked: You must complete your signup bonus turnover of ${remaining} TK.`
      );
    }
  }

  // ✅ 3. Login Bonus Turnover (includes referral rewards credited to balance)
  const loginBonus = await LoginBonusTracking.findOne({
    userId,
    isCompleted: false,
  });

  if (loginBonus && typeof loginBonus.turnoverRequired === 'number') {
    const remaining = Math.max(
      0,
      loginBonus.turnoverRequired - loginBonus.turnoverCompleted
    );
    if (remaining > 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Withdrawal blocked: Complete your login bonus turnover of ${remaining} TK.`
      );
    }
  }
};

export const createManualWithdraw = async (data: Partial<ITransaction>) => {
  const {
    userId,
    id,
    amount,
    paymentMethod,
    transactionId,
    walletNumber,
    accountHolderName,
  } = data;

  // 0) Basic validation
  if (
    !userId ||
    !id ||
    amount == null ||
    !paymentMethod ||
    !transactionId ||
    !walletNumber ||
    !accountHolderName
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Missing required fields');
  }

  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid amount');
  }

  // 1) Account status
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user.status !== 'active') {
    const reasons: Record<'frozen' | 'deactivated' | 'pending', string> = {
      frozen: 'Your account is temporarily frozen. Please contact support.',
      deactivated: 'Your account is deactivated. Withdrawals are not allowed.',
      pending: 'Your account is under review. Please complete verification.',
    };
    const reason =
      reasons[user.status as 'frozen' | 'deactivated' | 'pending'] ||
      'Withdrawals are not allowed for your account.';
    throw new AppError(httpStatus.FORBIDDEN, reason);
  }
  const hasDeposit = await Transaction.exists({
    userId,
    transactionType: 'deposit',
    status: 'success',
  });
  if (!hasDeposit) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You must complete at least one successful deposit before making a withdrawal.'
    );
  }
  // 2) Turnover guard (policy)
  await validateUserWithdrawal(userId.toString(), amt);

  // 3) Resolve memberId (sbmXXXX)
  const ubLean = await UserBalance.findOne({ userId }, { id: 1 }).lean();
  if (!ubLean?.id) {
    throw new AppError(httpStatus.NOT_FOUND, 'User balance record not found');
  }

  // -----------------------
  // Removed session/redis/socket logic entirely.
  // -----------------------

  // 4) Check available balance from DB (authoritative)
  const balanceRecord = await UserBalance.findOne({ userId }).lean();
  if (!balanceRecord) {
    throw new AppError(httpStatus.NOT_FOUND, 'User balance not found');
  }

  const availableBalance = Number(balanceRecord.currentBalance ?? 0);
  if (availableBalance < amt) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
  }

  // 5) Atomically reserve funds by updating Mongo (decrease currentBalance, increase lockedBalance)
  await UserBalance.updateOne(
    { userId },
    {
      $inc: {
        currentBalance: -amt,
        lockedBalance: amt,
      },
    }
  );

  // 6) Create pending withdrawal record
  const trx = await Transaction.create({
    userId,
    id,
    amount: amt,
    paymentMethod,
    transactionType: 'withdraw',
    transactionId,
    status: 'pending',
    invoiceId: uuidv4(),
    walletNumber,
    accountHolderName,
  });

  return trx;
};


export const createManualDeposit = async (data: Partial<ITransaction>) => {
  const { userId, id, amount, paymentMethod, transactionId, promoCode, agentNumber, walletNumber } = data;

  if (!userId || !id || !amount || !paymentMethod || !transactionId || !walletNumber || !agentNumber) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Missing required fields');
  }

  const resolvedPromoCode = promoCode?.trim() || 'NO_PROMO';
  const promoConfig = findPromotionByCode(resolvedPromoCode);
  if (!promoConfig) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid promotion code');
  }

  if (
    resolvedPromoCode !== 'NO_PROMO' &&
    Number(amount) < Number(promoConfig.minDeposit || 0)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Deposit amount must be at least ${promoConfig.minDeposit} for this promotion`
    );
  }

  let finalAmount = amount;
  let totalBonusAmount = 0;

  // ❌ ================================
  // ❌ 1. Login Bonus for Inactive Users (COMMENTED OUT)
  // ❌ ================================

  /*
  const user = await User.findById(userId);
  const lastLogin = user?.lastActiveAt;
  const now = new Date();
  const daysInactive = lastLogin
    ? Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  const eligibleAmounts = [1000, 2000, 5000];
  const bonusMap: Record<number, number> = { 1000: 100, 2000: 200, 5000: 500 };

  if (daysInactive >= 3 && eligibleAmounts.includes(amount)) {
    const loginBonus = bonusMap[amount];
    totalBonusAmount += loginBonus;
    finalAmount += loginBonus;

    await LoginBonusTracking.create({
      userId,
      depositAmount: amount,
      bonusAmount: loginBonus,
      turnoverRequired: loginBonus * 3,
      turnoverCompleted: 0,
      isCompleted: false,
    });
  }
  */

  // ❌ ================================
  // ❌ 2. Daily Promotional Offer Bonus (COMMENTED OUT)
  // ❌ ================================

  /*
  const todayDate = dayjs().date();
  const activeOffer = await UserOffer.findOne({
    status: 'on',
    activeDates: { $in: [todayDate] },
  });

  if (activeOffer) {
    const { value, valueType } = activeOffer;
    const offerBonus =
      valueType === 'percent'
        ? Math.floor(amount * (value / 100))
        : value;

    totalBonusAmount += offerBonus;
    finalAmount += offerBonus;
  }
  */

  // ✅ 3. Create Transaction (UNCHANGED)
  const trx = await Transaction.create({
    userId,
    id,
    amount: finalAmount, // now equals only deposit amount
    paymentMethod,
    transactionType: 'deposit',
    transactionId,
    status: 'pending',
    invoiceId: uuidv4(),
    promoCode: resolvedPromoCode,
    bonusAmount: totalBonusAmount, // will remain 0
    agentNumber,         
    walletNumber,        
  });
  return trx;
};


const markWithdrawSuccess = async (trxId: string) => {
  // 1) Validate and load transaction
  const trx = await Transaction.findById(trxId);
  if (!trx || trx.status !== 'pending' || trx.transactionType !== 'withdraw') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid transaction');
  }

  // 2) Mark transaction as successful
  trx.status = 'success';
  await trx.save();

  // 3) Update user balance (remove locked balance, add to totalWithdraw)
  const updatedBalance = await UserBalance.findOneAndUpdate(
    { userId: trx.userId },
    {
      $inc: {
        totalWithdraw: trx.amount,
        lockedBalance: -trx.amount, // release locked balance
      },
    },
    { new: true }
  );

  // 4) (Removed socket emit) – no balance:update event

  // 5) Return updated transaction record
  return trx;
};

const markCoinWithdrawSuccess = async (userId: string, coinAmount: number) => {
  const userBalance = await UserBalance.findOne({ userId });

  if (!userBalance) {
    throw new AppError(httpStatus.NOT_FOUND, 'User balance record not found');
  }

  if (userBalance.currentCoinBalance < coinAmount) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient coin balance');
  }

  const updated = await UserBalance.findOneAndUpdate(
    { userId },
    {
      $inc: {
        totalCoinWithdraw: coinAmount,
        currentCoinBalance: -coinAmount,
      },
    },
    { new: true }
  );

  return updated;
};

// 🔹 Helper: make all previous (open) turnovers inert
const resetOldTurnovers = async (userId: typeof Transaction.prototype.userId) => {
  await TurnoverTracking.updateMany(
    {
      userId,
      isCompleted: { $ne: true },
      turnoverRequired: { $gt: 0 },
    },
    {
      $set: {
        turnoverRequired: 0,
        isCompleted: true,
        eligibleGameTypes: ['none'],
        maxWithdraw: null,
      },
    }
  );
};

// deterministic idempotency key for deposits
const buildDepositExtId = (memberId: string, pspTxnId: string, amount: number) =>
  `DEPOSIT|${memberId}|${pspTxnId}|${Number(amount).toFixed(2)}`;

// deposits/markDepositSuccess.ts (FINAL DROP-IN)
export const markDepositSuccess = async (
  trxId: string,
  promoCodeFromBody?: string
) => {
  if (!trxId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Transaction ID is required');
  }

  const trx = await Transaction.findById(trxId);
  if (!trx || trx.status !== 'pending' || trx.transactionType !== 'deposit') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid transaction');
  }

  // ✅ Authoritative member id from UserBalance
  const ub = await UserBalance.findOne({ userId: trx.userId }, { id: 1 }).lean();
  if (!ub?.id) throw new AppError(httpStatus.NOT_FOUND, 'User balance record not found');
  const memberIdStr = String(ub.id);

  const successfulDeposits = await Transaction.countDocuments({
    userId: trx.userId,
    transactionType: 'deposit',
    status: 'success',
  });
  const isFirstDeposit = successfulDeposits === 0;

  // --- Referral release logic on first deposit ---
  // if (isFirstDeposit) {
  //   const pair = await ReferralModel.findOne({ referredUser: trx.userId }).lean();
  //   if (pair?.referrer) {
  //     const referrerId = String(pair.referrer);

  //     // Check if referrer has any deposit
  //     const refHasDeposit = await UserBalance.exists({
  //       userId: referrerId,
  //       totalDeposit: { $gt: 0 },
  //     });

  //     if (refHasDeposit) {
  //       // Get referrer's UserBalance
  //       const refUB = await UserBalance.findOne({ userId: referrerId }).lean();

  //       if (refUB?._id) {
  //         const bonusAmount = 500;
  //         const turnoverRequired = 4000;

  //         // 1️⃣ Create referral bonus tracking if not exists
  //         await ReferralBonusTracking.updateOne(
  //           { userId: referrerId, referredUserId: trx.userId },
  //           {
  //             $setOnInsert: {
  //               userId: referrerId,
  //               referredUserId: trx.userId,
  //               bonusAmount,
  //               turnoverRequired,
  //               turnoverCompleted: 0,
  //               isCompleted: false,
  //             },
  //           },
  //           { upsert: true }
  //         );

  //         // 2️⃣ Credit bonus directly to referrer's balance
  //         await UserBalance.updateOne(
  //           { userId: referrerId },
  //           { $inc: { currentBalance: bonusAmount },storeDbBalance:          bonusAmount }
  //         );

  //         // 3️⃣ Update referral reward summary
  //         await ReferralRewardModel.updateOne(
  //           { referrer: referrerId },
  //           { $inc: { totalReleasedTK: bonusAmount } },
  //           { upsert: true }
  //         );
  //       }
  //     } else {
  //       // If referrer has no deposit, keep bonus in pending
  //       await ReferralRewardModel.updateOne(
  //         { referrer: referrerId },
  //         { $setOnInsert: { referrer: referrerId }, $inc: { totalPendingTK: 500 } },
  //         { upsert: true }
  //       );
  //     }

  //     // 4️⃣ Release any pending referral bonuses
  //     await releaseReferralBonuses(referrerId);
  //   }
  // }

  // --- end referral release ---

  let promo = await PromotionService.getUserPromotion(trx.userId.toString());
  const promoCodeToUse = promoCodeFromBody || trx.promoCode;

  if (!promo) {
    if (!promoCodeToUse) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'First deposit must include a promoCode. Use "NO_PROMO" to opt out.'
      );
    }
    promo = await PromotionService.lockPromotionToUser(
      trx.userId.toString(),
      promoCodeToUse
    );
  } else if (!promo.promoIsLocked && promoCodeToUse && promoCodeToUse !== 'NO_PROMO') {
    promo = await PromotionService.lockPromotionToUser(
      trx.userId.toString(),
      promoCodeToUse
    );
  }

  // ===== NO_PROMO path =====
  if (!promo.selectedPromoCode || promo.selectedPromoCode === 'NO_PROMO') {
    // Lock NO_PROMO if needed
    if (!promo.promoIsLocked) {
      try {
        await PromotionService.lockPromotionToUser(trx.userId.toString(), 'NO_PROMO');
        promo.selectedPromoCode = 'NO_PROMO';
        promo.promoIsLocked = true;
      } catch (err: any) {
        if (err.code === 11000) {
          promo.selectedPromoCode = 'NO_PROMO';
          promo.promoIsLocked = true;
        } else throw err;
      }
    }

    trx.status = 'success';
    trx.bonusAmount = 0;
    await trx.save();

    // await GameTxnRecord.updateMany(
    //   { sbmId: memberIdStr, alreadyTaken: false },
    //   { $set: { alreadyTaken: true } }
    // );
    try {
      // 1️⃣ Fetch all records for this user
      const records = await GameTxnRecord.find({ sbmId: memberIdStr }).lean();

      if (records.length > 0) {
        // 2️⃣ Backup all records quickly
        await GameTxnRecordBackup.insertMany(
          records.map(r => ({
            ...r,
            backupReason: 'User made a new deposit — backup before full delete',
            backupDate: new Date(),
          })),
          { ordered: false } // continue even if some duplicates
        );

        // 3️⃣ Delete all records for this user
        await GameTxnRecord.deleteMany({ sbmId: memberIdStr });

        console.log(`✅ Backed up & deleted ${records.length} GameTxnRecords for user ${memberIdStr}`);
      } else {
        console.log(`ℹ️ No GameTxnRecords found for user ${memberIdStr}`);
      }
    } catch (error) {
      console.error(`❌ Error during backup/delete for ${memberIdStr}:`, error);
    }


    await SignupBonusTracking.updateOne(
      { userId: trx.userId, isCompleted: false },
      { $set: { isCompleted: true, updatedAt: new Date() } }
    );
    // Only add actual deposit to balance
    const updatedBalance = await UserBalance.findOneAndUpdate(
      { userId: trx.userId },
      [
        {
          $set: {
            totalDeposit: { $add: [{ $ifNull: ["$totalDeposit", 0] }, trx.amount] },

            // ✅ safety credit (negative treated as 0)
            currentBalance: {
              $add: [{ $max: [{ $ifNull: ["$currentBalance", 0] }, 0] }, trx.amount],
            },

            // ✅ also add to storeDbBalance
            storeDbBalance: {
              $add: [{ $ifNull: ["$storeDbBalance", 0] }, trx.amount],
            },
          },
        },
      ],
      { upsert: true, new: true }
    );


    await TurnoverTracking.create({
      userId: trx.userId,
      depositId: trx._id,
      appliesToDepositId: trx._id,
      depositAmount: trx.amount,
      bonusAmount: 0,
      turnoverRequired: Number(trx.amount) * 1,
      turnoverCompleted: 0,
      eligibleGameTypes: ['all'],
      isCompleted: false,
      isClaimed: false,
      promoCode: 'NO_PROMO',
      usageType: 'none',
      maxWithdraw: null,
      isActive: true,
    });

    const totalDeposit = updatedBalance?.totalDeposit || 0;
    const newLevel = determineUserLevel(totalDeposit);
    await User.findByIdAndUpdate(trx.userId, { userLevel: newLevel });
    await NormalUser.findOneAndUpdate({ user: trx.userId }, { userLevel: newLevel });

    return {
      ...trx.toObject(),
      bonusAmount: 0,
      totalCredited: trx.amount,
      promotionApplied: 'NO_PROMO',
    };
  }

  // ===== PROMO branch =====
  const {
    bonusRate,
    turnoverX,
    selectedPromoCode,
    usageType,
    eligibleGames,
    maxWithdrawLimit,
    minDeposit,
    maxBonusCap,
  } = promo;

  if (
    turnoverX === undefined || turnoverX === null || isNaN(turnoverX as any) ||
    bonusRate === undefined || bonusRate === null || isNaN(bonusRate as any)
  ) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Promotion config invalid');
  }

  let bonusAmount = 0;
  const userBalance = await UserBalance.findOne({ userId: trx.userId });
  if (!userBalance) {
    throw new AppError(httpStatus.NOT_FOUND, 'User balance not found');
  }

  const depositAmt = Number(trx.amount);
  const meetsMin = depositAmt >= Number(minDeposit || 0);

  if (!meetsMin) {
    bonusAmount = 0;
  } else {
    let baseBonus = 0;
    if (selectedPromoCode === 'PROMO_300_FIXED') {
      baseBonus = depositAmt >= 500 ? 300 : 0;
    } else {
      baseBonus = Math.floor(depositAmt * Number(bonusRate || 0));
    }

    if (usageType === 'once') {
      const everUsed = await TurnoverTracking.exists({
        userId: trx.userId,
        promoCode: selectedPromoCode,
      });
      bonusAmount = everUsed ? 0 : baseBonus;

    } else if (usageType === 'daily') {
      const todayStart = dayjs().tz('Asia/Dhaka').startOf('day').toDate();
      const todayEnd = dayjs().tz('Asia/Dhaka').endOf('day').toDate();
      const usedToday = await TurnoverTracking.exists({
        userId: trx.userId,
        promoCode: selectedPromoCode,
        createdAt: { $gte: todayStart, $lte: todayEnd },
      });

      if (usedToday) bonusAmount = 0;
      else {
        if (maxBonusCap && baseBonus > Number(maxBonusCap)) {
          bonusAmount = Number(maxBonusCap);
        } else {
          bonusAmount = baseBonus;
        }
      }

    } else if (usageType === 'always') {
      let cappedBonus = baseBonus;
      if (maxBonusCap) {
        const lifetime = await TurnoverTracking.aggregate([
          { $match: { userId: trx.userId, promoCode: selectedPromoCode } },
          { $group: { _id: null, total: { $sum: { $ifNull: ['$bonusAmount', 0] } } } },
        ]);
        const lifetimeTotal = Number(lifetime?.[0]?.total || 0);
        const remaining = Number(maxBonusCap) - lifetimeTotal;
        if (remaining <= 0) cappedBonus = 0;
        else if (cappedBonus > remaining) cappedBonus = remaining;
      }
      bonusAmount = Math.max(0, Math.floor(cappedBonus));
    } else {
      bonusAmount = 0;
    }
  }

  // ===== NORMAL PROMO APPLY =====
  const totalCredited = Number(trx.amount) + Number(bonusAmount);

  trx.status = 'success';
  trx.bonusAmount = bonusAmount;
  await trx.save();

  // await GameTxnRecord.updateMany(
  //   { sbmId: memberIdStr, alreadyTaken: false },
  //   { $set: { alreadyTaken: true } }
  // );
  try {
    // 1️⃣ Fetch all records for this user
    const records = await GameTxnRecord.find({ sbmId: memberIdStr }).lean();

    if (records.length > 0) {
      // 2️⃣ Backup all records quickly
      await GameTxnRecordBackup.insertMany(
        records.map(r => ({
          ...r,
          backupReason: 'User made a new deposit — backup before full delete',
          backupDate: new Date(),
        })),
        { ordered: false } // continue even if some duplicates
      );

      // 3️⃣ Delete all records for this user
      await GameTxnRecord.deleteMany({ sbmId: memberIdStr });

      console.log(`✅ Backed up & deleted ${records.length} GameTxnRecords for user ${memberIdStr}`);
    } else {
      console.log(`ℹ️ No GameTxnRecords found for user ${memberIdStr}`);
    }
  } catch (error) {
    console.error(`❌ Error during backup/delete for ${memberIdStr}:`, error);
  }


  await SignupBonusTracking.updateOne(
    { userId: trx.userId, isCompleted: false },
    { $set: { isCompleted: true, updatedAt: new Date() } }
  );
 const updatedBalance = await UserBalance.findOneAndUpdate(
  { userId: trx.userId },
  [
    {
      $set: {
        totalDeposit: { $add: [{ $ifNull: ["$totalDeposit", 0] }, trx.amount] },

        // ✅ safety credit: max(currentBalance,0) + totalCredited
        currentBalance: {
          $add: [{ $max: [{ $ifNull: ["$currentBalance", 0] }, 0] }, totalCredited],
        },

        // ✅ storeDbBalance + totalCredited
        storeDbBalance: {
          $add: [{ $ifNull: ["$storeDbBalance", 0] }, totalCredited],
        },
      },
    },
  ],
  { upsert: true, new: true }
);


  await resetOldTurnovers(trx.userId);

  const promoActuallyApplied = Number(bonusAmount) > 0;
  const effectiveTurnoverRequired = promoActuallyApplied
    ? (Number(trx.amount) + Number(bonusAmount)) * Number(turnoverX)
    : Number(trx.amount) * 1;
  const effectiveEligibleGames = promoActuallyApplied ? eligibleGames : ['all'];
  const effectivePromoCode = promoActuallyApplied ? selectedPromoCode : 'NO_PROMO';
  const effectiveUsageType = promoActuallyApplied ? usageType : 'none';

  await TurnoverTracking.create({
    userId: trx.userId,
    depositId: trx._id,
    appliesToDepositId: trx._id,
    depositAmount: trx.amount,
    bonusAmount,
    turnoverRequired: effectiveTurnoverRequired,
    eligibleGameTypes: effectiveEligibleGames,
    maxWithdraw: maxWithdrawLimit ?? null,
    promoCode: effectivePromoCode,
    usageType: effectiveUsageType,
    isActive: true,
  });

  const totalDeposit = updatedBalance?.totalDeposit || 0;
  const newLevel = determineUserLevel(totalDeposit);
  await User.findByIdAndUpdate(trx.userId, { userLevel: newLevel });
  await NormalUser.findOneAndUpdate({ user: trx.userId }, { userLevel: newLevel });

  return {
    ...trx.toObject(),
    bonusAmount,
    totalCredited,
    promotionApplied: promoActuallyApplied ? selectedPromoCode : 'NO_PROMO',
  };
};

const getUserBalance = async (memberOrUserId: string) => {
  const raw = String(memberOrUserId ?? '').trim();
  if (!raw) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User id is required');
  }

  let balance = null;

  // Member id on UserBalance.id (e.g. sbm47374) — same as login lookup
  if (/^sbm/i.test(raw)) {
    balance = await UserBalance.findOne({ id: raw.toLowerCase() })
      .lean()
      .maxTimeMS(2000)
      .exec();
  }

  // MongoDB ObjectId → UserBalance.userId
  if (!balance && Types.ObjectId.isValid(raw)) {
    balance = await UserBalance.findOne({ userId: new Types.ObjectId(raw) })
      .lean()
      .maxTimeMS(2000)
      .exec();
  }

  // Fallback: exact id string
  if (!balance) {
    balance = await UserBalance.findOne({ id: raw })
      .lean()
      .maxTimeMS(2000)
      .exec();
  }

  if (!balance) throw new AppError(httpStatus.NOT_FOUND, 'Balance not found');

  return balance;
};

const getAllTransactions = async (filter: any) => {
  const result = await Transaction.find(filter).populate('userId').sort({ createdAt: -1 });
  return result;
};

const getUserTransactions = async (filters: Record<string, any>) => {
  const query = { ...filters };

  if (query.userId && typeof query.userId === 'string') {
    query.userId = new Types.ObjectId(query.userId);
  }

  if (query.from || query.to) {
    query.createdAt = {};
    if (query.from) {
      query.createdAt.$gte = new Date(query.from);
      delete query.from;
    }
    if (query.to) {
      query.createdAt.$lte = new Date(query.to);
      delete query.to;
    }
  }

  if (typeof query.status === 'string' && query.status.includes(',')) {
    query.status = { $in: query.status.split(',').map((s: string) => s.trim()) };
  }

  if (
    typeof query.transactionType === 'string' &&
    query.transactionType.includes(',')
  ) {
    query.transactionType = {
      $in: query.transactionType.split(',').map((s: string) => s.trim()),
    };
  }

  return await Transaction.find(query).sort({ createdAt: -1 }).lean();
};

const rejectWithdraw = async (trxId: string) => {
  // 1) Find transaction
  const trx = await Transaction.findById(trxId);
  if (!trx || trx.status !== 'pending') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid transaction');
  }

  // 2) Mark withdrawal as failed
  trx.status = 'failed';
  await trx.save();

  // 3) If it was a withdrawal, refund the amount back to user's balance
  if (trx.transactionType === 'withdraw') {
    await UserBalance.updateOne(
      { userId: trx.userId },
      {
        $inc: {
          currentBalance: trx.amount,  // refund money back to available balance
          lockedBalance: -trx.amount,  // release locked balance
        },
      }
    );
  }

  // 4) Return updated transaction
  return trx;
};

const updateStoreDbBalanceService = async (userId: string, newAmount: number) => {
  if (!userId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'userId is required in query params');
  }

  if (typeof newAmount !== 'number' || isNaN(newAmount)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid amount');
  }

  const updated = await UserBalance.findOneAndUpdate(
    { userId },
    { $set: { storeDbBalance: newAmount } },
    { new: true }
  );

  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, 'User balance not found');
  }

  return {
    message: `storeDbBalance successfully updated to ${newAmount}`,
    userId,
    storeDbBalance: updated.storeDbBalance,
  };
};

const normalizeTrxId = (value: string) => value.trim().toUpperCase();

const amountsMatch = (smsAmount: number, expected: number) =>
  Math.abs(Number(smsAmount) - Number(expected)) < 0.01;

/** Match pending deposit against PipraPay SMS (amount + TrxID/TxnID). */
const verifyAutoPayDeposit = async (
  userObjectId: string,
  input: {
    depositTransactionId: string;
    amount: number;
    transactionId: string;
    paymentMethod: AutoPayPaymentMethod;
  }
) => {
  const { depositTransactionId, amount, transactionId, paymentMethod } = input;

  if (!Types.ObjectId.isValid(depositTransactionId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid deposit transaction id');
  }

  const trx = await Transaction.findById(depositTransactionId);
  if (!trx || trx.transactionType !== 'deposit') {
    throw new AppError(httpStatus.NOT_FOUND, 'Deposit transaction not found');
  }

  if (String(trx.userId) !== String(userObjectId)) {
    throw new AppError(httpStatus.FORBIDDEN, 'Not allowed to verify this deposit');
  }

  if (trx.status === 'success') {
    const balance = await UserBalance.findOne({ userId: trx.userId }).lean();
    return {
      matched: true,
      status: 'success' as const,
      transaction: trx,
      currentBalance: balance?.currentBalance ?? 0,
    };
  }

  if (trx.status === 'failed') {
    return { matched: false, status: 'failed' as const, transaction: trx };
  }

  const expectedTrxId = normalizeTrxId(transactionId);
  const storedTrxId = normalizeTrxId(trx.transactionId);
  if (expectedTrxId !== storedTrxId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Transaction ID does not match deposit record');
  }

  if (!amountsMatch(trx.amount, amount)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Amount does not match deposit record');
  }

  if (trx.paymentMethod !== paymentMethod) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Payment method does not match deposit record'
    );
  }

  const smsCandidates = await AutoPaySms.find({
    trxid: expectedTrxId,
    status: { $ne: 'verified' },
  })
    .sort({ receivedAt: -1 })
    .lean();

  const sms = smsCandidates.find(
    (row) =>
      amountsMatch(row.amount, amount) &&
      smsMatchesPaymentMethod(row, paymentMethod)
  );

  if (!sms) {
    return { matched: false, status: 'pending' as const, transaction: trx };
  }

  const reserved = await AutoPaySms.findOneAndUpdate(
    {
      _id: sms._id,
      status: { $ne: 'verified' },
      trxid: expectedTrxId,
    },
    {
      $set: {
        status: 'verified',
        matchedTransactionId: trx._id,
        matchedAt: new Date(),
      },
    },
    { new: true }
  );

  if (!reserved) {
    return { matched: false, status: 'pending' as const, transaction: trx };
  }

  try {
    const approved = await markDepositSuccess(
      String(trx._id),
      trx.promoCode || 'NO_PROMO'
    );
    const balance = await UserBalance.findOne({ userId: trx.userId }).lean();
    return {
      matched: true,
      status: 'success' as const,
      transaction: approved,
      currentBalance: balance?.currentBalance ?? 0,
    };
  } catch (err) {
    await AutoPaySms.updateOne(
      { _id: reserved._id },
      {
        $set: { status: 'pending' },
        $unset: { matchedTransactionId: 1, matchedAt: 1 },
      }
    );
    throw err;
  }
};

const failAutoPayDeposit = async (
  userObjectId: string,
  depositTransactionId: string
) => {
  if (!Types.ObjectId.isValid(depositTransactionId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid deposit transaction id');
  }

  const trx = await Transaction.findById(depositTransactionId);
  if (!trx || trx.transactionType !== 'deposit') {
    throw new AppError(httpStatus.NOT_FOUND, 'Deposit transaction not found');
  }

  if (String(trx.userId) !== String(userObjectId)) {
    throw new AppError(httpStatus.FORBIDDEN, 'Not allowed to update this deposit');
  }

  if (trx.status === 'pending') {
    trx.status = 'failed';
    await trx.save();
  }

  return trx;
};

export const TransactionService = {
  createManualDeposit,
  createManualWithdraw,
  markCoinWithdrawSuccess,
  markWithdrawSuccess,
  markDepositSuccess,
  getUserBalance,
  updateStoreDbBalanceService,
  getAllTransactions,
  getUserTransactions,
  rejectWithdraw,
  verifyAutoPayDeposit,
  failAutoPayDeposit,
};
