export type PromotionConfig = {
  code: string;
  title: string;
  titleBn?: string;
  description?: string;
  descriptionBn?: string;
  minDeposit: number;
  bonusRate: number;
  fixedBonus?: number;
  turnoverX: number;
  eligibleGames: string[];
  maxWithdrawLimit: number | null;
  usageType: string;
  maxBonusCap?: number;
  validFrom?: string;
  validTo?: string;
};

export type DepositPromotionDto = {
  code: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  minDeposit: number;
  bonusRate: number;
  fixedBonus?: number;
  turnoverX: number;
  eligibleGames: string[];
  usageType: string;
  maxBonusCap?: number;
  maxWithdrawLimit: number | null;
  validFrom: string;
  validTo: string;
  isValid: boolean;
};
