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
import { assertAccountActiveForRestrictedAction } from '../User/userAccountStatus.util';
import { PartnerCommissionService } from '../PartnerCommission/partnerCommission.service';
import { Types } from 'mongoose';
import { GameTxnRecord } from '../GameTxnRecords/models/GameTxnRecord';
import { GameTxnRecordBackup } from '../GameTxnRecords/models/gameTxnRecordBackup.model';
import { AutoPaySms } from '../AutoPay/autopaySms.model';
import { findPromotionByCode } from '../Promotion/promotion.constant';
import { resolveNormalDepositBonus } from './normalDepositBonus.util';
import {
  smsMatchesPaymentMethod,
  type AutoPayPaymentMethod,
} from '../AutoPay/matchPaymentProvider';

// dayjs tz setup (needed for .tz(...) usage)
dayjs.extend(utc);
dayjs.extend(timezone);

const validateUserWithdrawal = async (userId: string, amount: number) => {
  // ✅ 0. Minimum/Maximum rules
  if (amount < 100) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Minimum withdrawal is 100 TK.');
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
  await assertAccountActiveForRestrictedAction(userId.toString());

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

export const createAdminManualWithdraw = async (data: Partial<ITransaction>) => {
  const {
    userId,
    id,
    amount,
    paymentMethod,
    transactionId,
    walletNumber,
    accountHolderName,
  } = data;

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

  const balanceRecord = await UserBalance.findOne({ userId }).lean();
  if (!balanceRecord) {
    throw new AppError(httpStatus.NOT_FOUND, 'User balance not found');
  }

  const availableBalance = Number(balanceRecord.currentBalance ?? 0);
  if (availableBalance < amt) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
  }

  await UserBalance.updateOne(
    { userId },
    {
      $inc: {
        currentBalance: -amt,
        lockedBalance: amt,
      },
    },
  );

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

  const normalizedTransactionId = String(transactionId).trim().toUpperCase();
  if (!normalizedTransactionId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Transaction ID is required');
  }

  const existingWithTxnId = await Transaction.findOne({
    transactionType: 'deposit',
    transactionId: {
      $regex: `^${normalizedTransactionId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
      $options: 'i',
    },
  }).select('_id').lean();

  if (existingWithTxnId) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This transaction ID has already been submitted',
    );
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
    transactionId: normalizedTransactionId,
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

  try {
    await PartnerCommissionService.applyWithdrawCommission(
      trx as ITransaction & { _id: Types.ObjectId },
    );
  } catch (err) {
    console.error('Partner withdraw commission failed:', err);
  }

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

// 🔹 Helper: make all previous (open) turnovers inert — only latest deposit counts
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
        isActive: false,
        countingWindowClosedAt: new Date(),
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
  const depositPromoCode = (promoCodeFromBody || trx.promoCode || 'NO_PROMO').trim();

  if (!promo) {
    if (!depositPromoCode) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'First deposit must include a promoCode. Use "NO_PROMO" to opt out.'
      );
    }
    promo = await PromotionService.lockPromotionToUser(
      trx.userId.toString(),
      depositPromoCode
    );
  } else if (!promo.promoIsLocked && depositPromoCode && depositPromoCode !== 'NO_PROMO') {
    promo = await PromotionService.lockPromotionToUser(
      trx.userId.toString(),
      depositPromoCode
    );
  }

  // ===== NO_PROMO path =====
  if (depositPromoCode === 'NO_PROMO') {
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
    const bonus = resolveNormalDepositBonus(trx.amount, successfulDeposits);
    const { bonusAmount, totalCredited } = bonus;
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

            currentBalance: {
              $add: [{ $max: [{ $ifNull: ["$currentBalance", 0] }, 0] }, totalCredited],
            },

            storeDbBalance: {
              $add: [{ $ifNull: ["$storeDbBalance", 0] }, totalCredited],
            },
          },
        },
      ],
      { upsert: true, new: true }
    );


    await resetOldTurnovers(trx.userId);

    await TurnoverTracking.create({
      userId: trx.userId,
      depositId: trx._id,
      appliesToDepositId: trx._id,
      depositAmount: trx.amount,
      bonusAmount,
      turnoverRequired: bonus.turnoverRequired,
      turnoverCompleted: 0,
      eligibleGameTypes: ['all'],
      isCompleted: false,
      isClaimed: false,
      promoCode: bonus.promoCode,
      usageType: bonus.isTierBonus ? 'once' : 'always',
      maxWithdraw: null,
      isActive: true,
    });

    const totalDeposit = updatedBalance?.totalDeposit || 0;
    const newLevel = determineUserLevel(totalDeposit);
    await User.findByIdAndUpdate(trx.userId, { userLevel: newLevel });
    await NormalUser.findOneAndUpdate({ user: trx.userId }, { userLevel: newLevel });

    try {
      await PartnerCommissionService.applyDepositCommission(
        trx as ITransaction & { _id: Types.ObjectId },
      );
    } catch (err) {
      console.error('Partner deposit commission failed:', err);
    }

    return {
      ...trx.toObject(),
      bonusAmount,
      totalCredited,
      promotionApplied: bonus.promoCode,
      tierNumber: bonus.tierNumber,
    };
  }

  // ===== PROMO branch =====
  const promoConfig = findPromotionByCode(depositPromoCode);
  if (!promoConfig) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid promotion code');
  }

  const {
    bonusRate,
    turnoverX,
    code: selectedPromoCode,
    usageType,
    eligibleGames,
    maxWithdrawLimit,
    minDeposit,
    maxBonusCap,
  } = promoConfig;

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
  const effectiveEligibleGames =
    !promoActuallyApplied ||
    !eligibleGames?.length ||
    eligibleGames.includes('all')
      ? ['all']
      : eligibleGames;
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

  try {
    await PartnerCommissionService.applyDepositCommission(
      trx as ITransaction & { _id: Types.ObjectId },
    );
  } catch (err) {
    console.error('Partner deposit commission failed:', err);
  }

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

  // Member id on UserBalance.id (e.g. sbm47374, bkb47703) — same as login lookup
  if (/^(?:sbm|bkb)/i.test(raw)) {
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

const getAllTransactions = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};

  if (typeof query.status === 'string' && query.status) {
    filter.status = query.status;
  }

  const transactionType =
    (typeof query.transactionType === 'string' && query.transactionType) ||
    (typeof query.type === 'string' && query.type);
  if (transactionType) {
    filter.transactionType = transactionType;
  }

  if (typeof query.paymentMethod === 'string' && query.paymentMethod) {
    filter.paymentMethod = query.paymentMethod;
  }

  const result = await Transaction.find(filter)
    .populate('userId', 'userName id contactNo')
    .sort({ createdAt: -1 })
    .lean();

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

const getDepositBonusPreview = async (
  userId: string,
  amount: number,
  promoCode: string,
) => {
  const resolvedPromoCode = promoCode?.trim() || 'NO_PROMO';

  if (resolvedPromoCode !== 'NO_PROMO') {
    return { applicable: false as const };
  }

  const successfulDeposits = await Transaction.countDocuments({
    userId: new Types.ObjectId(userId),
    transactionType: 'deposit',
    status: 'success',
  });

  const bonus = resolveNormalDepositBonus(amount, successfulDeposits);

  return {
    applicable: true as const,
    bonusAmount: bonus.bonusAmount,
    bonusRate: bonus.bonusRate,
    turnoverX: bonus.turnoverX,
    totalCredited: bonus.totalCredited,
    tierNumber: bonus.tierNumber,
    isTierBonus: bonus.isTierBonus,
    successfulDeposits,
  };
};

const GAME_PLAYER_PREFIX =
  process.env.GAME_LAUNCH_PLAYER_PREFIX || 'h94044';
const GAME_MEMBER_SUFFIX = 'b';
const TX_SERVER_WITHDRAW_URL =
  process.env.TX_SERVER_WITHDRAW_URL || 'https://txserver.site/getWithdraw.php';
const GAME_HOME_URL =
  process.env.GAME_LAUNCH_HOME_URL || 'https://banglajackpot.online';

const buildGameMemberAccount = (memberId: string): string => {
  const id = String(memberId ?? '').trim().toLowerCase();
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Member id is required');
  }
  return `${GAME_PLAYER_PREFIX}_${id}_${GAME_MEMBER_SUFFIX}`;
};

const generateGameTransferId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1e6);
  return `tx_${timestamp}_${random}`;
};

/**
 * After game launch URL is obtained: zero Mongo balance and mark game session active.
 */
const prepareGameLaunch = async (memberId: string) => {
  const id = String(memberId ?? '').trim().toLowerCase();
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Member id is required');
  }

  const existing = await UserBalance.findOne({ id }).lean();
  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, 'User balance not found');
  }

  if (existing.gameSessionActive) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Game session already active. Complete balance return first.'
    );
  }

  const creditAmount = Number(existing.currentBalance ?? 0);
  if (!(creditAmount > 0)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance to launch game');
  }

  const updated = await UserBalance.findOneAndUpdate(
    { id, gameSessionActive: { $ne: true } },
    {
      $set: {
        currentBalance: 0,
        gameSessionActive: true,
        gameSessionZeroedAt: new Date(),
      },
      $inc: { walletRevision: 1 },
    },
    { new: true }
  ).lean();

  if (!updated) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Game session already active. Complete balance return first.'
    );
  }

  return {
    creditAmount: parseFloat(creditAmount.toFixed(2)),
    currentBalance: 0,
    walletRevision: Number(updated.walletRevision ?? 0),
    gameSessionActive: true,
  };
};

type TxWithdrawResponse = {
  status?: boolean;
  message?: string;
  amount?: string | number;
};

/**
 * On return from game: call getWithdraw.php, then set
 * currentBalance = withdrawnAmount + credits landed while away (Option B).
 */
const returnGameWithdraw = async (memberId: string) => {
  const id = String(memberId ?? '').trim().toLowerCase();
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Member id is required');
  }

  const existing = await UserBalance.findOne({ id }).lean();
  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, 'User balance not found');
  }

  if (!existing.gameSessionActive) {
    return {
      currentBalance: Number(existing.currentBalance ?? 0),
      withdrawnAmount: 0,
      creditsWhileAway: 0,
      gameSessionActive: false,
      skipped: true as const,
      walletRevision: Number(existing.walletRevision ?? 0),
    };
  }

  const payload = {
    member_account: buildGameMemberAccount(id),
    timestamp: Date.now(),
    credit_amount: 0,
    currency_code: 'BDT',
    language: 'en',
    platform: 'web',
    home_url: GAME_HOME_URL,
    transfer_id: generateGameTransferId(),
  };

  let providerJson: TxWithdrawResponse;
  try {
    const res = await fetch(TX_SERVER_WITHDRAW_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    providerJson = (await res.json().catch(() => ({}))) as TxWithdrawResponse;
    if (!res.ok) {
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        providerJson?.message || `Withdraw provider error (${res.status})`
      );
    }
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      err instanceof Error ? err.message : 'Failed to reach withdraw provider'
    );
  }

  if (providerJson.status === false) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      providerJson.message || 'Withdraw unsuccessful'
    );
  }

  const withdrawnAmount = Number.parseFloat(String(providerJson.amount ?? 0));
  if (!Number.isFinite(withdrawnAmount) || withdrawnAmount < 0) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'Invalid withdraw amount from provider');
  }

  // Re-read so deposits/bonuses while in-game are included (Option B).
  const latest = await UserBalance.findOne({ id }).lean();
  if (!latest) {
    throw new AppError(httpStatus.NOT_FOUND, 'User balance not found');
  }
  if (!latest.gameSessionActive) {
    return {
      currentBalance: Number(latest.currentBalance ?? 0),
      withdrawnAmount: parseFloat(withdrawnAmount.toFixed(2)),
      creditsWhileAway: 0,
      gameSessionActive: false,
      skipped: true as const,
      walletRevision: Number(latest.walletRevision ?? 0),
    };
  }

  const creditsWhileAway = Number(latest.currentBalance ?? 0);
  const finalBalance = parseFloat((withdrawnAmount + creditsWhileAway).toFixed(2));

  const updated = await UserBalance.findOneAndUpdate(
    { id, gameSessionActive: true },
    {
      $set: {
        currentBalance: finalBalance,
        gameSessionActive: false,
        gameSessionZeroedAt: null,
      },
      $inc: { walletRevision: 1 },
    },
    { new: true }
  ).lean();

  if (!updated) {
    const again = await UserBalance.findOne({ id }).lean();
    return {
      currentBalance: Number(again?.currentBalance ?? finalBalance),
      withdrawnAmount: parseFloat(withdrawnAmount.toFixed(2)),
      creditsWhileAway: parseFloat(creditsWhileAway.toFixed(2)),
      gameSessionActive: false,
      skipped: true as const,
      walletRevision: Number(again?.walletRevision ?? 0),
    };
  }

  return {
    currentBalance: Number(updated.currentBalance ?? finalBalance),
    withdrawnAmount: parseFloat(withdrawnAmount.toFixed(2)),
    creditsWhileAway: parseFloat(creditsWhileAway.toFixed(2)),
    gameSessionActive: false,
    skipped: false as const,
    walletRevision: Number(updated.walletRevision ?? 0),
  };
};

export const TransactionService = {
  createManualDeposit,
  createManualWithdraw,
  createAdminManualWithdraw,
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
  getDepositBonusPreview,
  prepareGameLaunch,
  returnGameWithdraw,
};
