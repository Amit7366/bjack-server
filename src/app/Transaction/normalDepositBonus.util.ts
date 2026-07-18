export const NEW_MEMBER_TIER_AMOUNT = 100;
export const NEW_MEMBER_TIER_TURNOVER_X = 17;
export const NEW_MEMBER_TIER_RATES = [1.2, 0.48, 0.38] as const;

export type NormalDepositBonusResult = {
  bonusAmount: number;
  totalCredited: number;
  turnoverRequired: number;
  turnoverX: number;
  promoCode: string;
  isTierBonus: boolean;
  tierNumber: number | null;
  bonusRate: number;
};

export function resolveNormalDepositBonus(
  amount: number,
  successfulDeposits: number,
): NormalDepositBonusResult {
  const depositAmt = Number(amount);
  const tierIndex = successfulDeposits;

  if (
    depositAmt === NEW_MEMBER_TIER_AMOUNT &&
    tierIndex >= 0 &&
    tierIndex < NEW_MEMBER_TIER_RATES.length
  ) {
    const rate = NEW_MEMBER_TIER_RATES[tierIndex];
    const bonusAmount = Math.floor(depositAmt * rate);
    const totalCredited = depositAmt + bonusAmount;
    return {
      bonusAmount,
      totalCredited,
      turnoverRequired: totalCredited * NEW_MEMBER_TIER_TURNOVER_X,
      turnoverX: NEW_MEMBER_TIER_TURNOVER_X,
      promoCode: `NO_PROMO_TIER_${tierIndex + 1}`,
      isTierBonus: true,
      tierNumber: tierIndex + 1,
      bonusRate: rate,
    };
  }

  const bonusAmount = Math.floor(depositAmt * 0.05);
  const totalCredited = depositAmt + bonusAmount;
  return {
    bonusAmount,
    totalCredited,
    turnoverRequired: totalCredited * 1,
    turnoverX: 1,
    promoCode: 'NO_PROMO',
    isTierBonus: false,
    tierNumber: null,
    bonusRate: 0.05,
  };
}
