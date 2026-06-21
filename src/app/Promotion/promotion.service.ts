import type { DepositPromotionDto } from "./promotion.types";
import { PROMOTION_LIST } from "./promotion.constant";

const toDto = (p: (typeof PROMOTION_LIST)[number]): DepositPromotionDto => {
  const isValid = true;
  return {
    code: p.code,
    title: p.title,
    titleBn: p.titleBn ?? p.title,
    description: p.description ?? p.title,
    descriptionBn: p.descriptionBn ?? p.titleBn ?? p.title,
    minDeposit: p.minDeposit,
    bonusRate: p.bonusRate,
    fixedBonus: p.fixedBonus,
    turnoverX: p.turnoverX,
    eligibleGames: p.eligibleGames,
    usageType: p.usageType,
    maxBonusCap: p.maxBonusCap,
    maxWithdrawLimit: p.maxWithdrawLimit,
    validFrom: p.validFrom ?? "2026-01-01 00:00:00",
    validTo: p.validTo ?? "2099-12-31 23:59:59",
    isValid,
  };
};

export const PromotionService = {
  getDepositPromotions(): DepositPromotionDto[] {
    return PROMOTION_LIST.map((p) => toDto(p));
  },

  getPublicDepositPromotions(): DepositPromotionDto[] {
    return PROMOTION_LIST.filter((p) => p.code !== "NO_PROMO").map((p) => toDto(p));
  },

  isValidPromoCode(code: string): boolean {
    return PROMOTION_LIST.some((p) => p.code === code);
  },
};
