import { PROMOTION_LIST } from '../Promotion/promotion.constant';
import { UserPromotion } from './userPromotion.model';

export const PromotionService = {
  getPromotionByCode: (code: string) => {
    return PROMOTION_LIST.find((p) => p.code === code);
  },

  isPromoAlreadySelected: async (userId: string) => {
    return await UserPromotion.findOne({ userId });
  },

  lockPromotionToUser: async (userId: string, code: string) => {
    if (code === 'NO_PROMO') {
      const promo = PromotionService.getPromotionByCode('NO_PROMO');
      return await UserPromotion.create({
        userId,
        selectedPromoCode: 'NO_PROMO',
        bonusRate: promo?.bonusRate ?? 0.02,
        turnoverX: promo?.turnoverX ?? 1,
        eligibleGames: promo?.eligibleGames ?? ['all'],
        maxWithdrawLimit: promo?.maxWithdrawLimit ?? null,
        usageType: promo?.usageType ?? 'always',
        promoIsLocked: true,
        promoCode: 'NO_PROMO',
        minDeposit: promo?.minDeposit ?? 0,
      });
    }

    const promo = PromotionService.getPromotionByCode(code);
    if (!promo) throw new Error('Invalid promotion code');

    const alreadySelected = await UserPromotion.findOne({ userId });
    if (alreadySelected?.promoIsLocked) {
      throw new Error('Promotion already selected');
    }

    const newPromo = await UserPromotion.findOneAndUpdate(
      { userId },
      {
        userId,
        selectedPromoCode: promo.code,
        bonusRate: promo.bonusRate,
        turnoverX: promo.turnoverX,
        eligibleGames: promo.eligibleGames,
        maxWithdrawLimit: promo.maxWithdrawLimit ?? null,
        usageType: promo.usageType,
        promoIsLocked: true,

        // ✅ NEW FIELDS
        promoCode: promo.code,
        // refundTrigger: promo.refundTrigger ?? false,
        minDeposit: promo.minDeposit ?? 0,
        maxBonusCap: promo.maxBonusCap ?? null,
      },
      { new: true, upsert: true }
    );

    return newPromo;
  },

  getUserPromotion: async (userId: string) => {
    return await UserPromotion.findOne({ userId });
  },
};
