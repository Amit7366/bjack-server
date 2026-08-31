export const PAYMENT_METHODS = ['bkash', 'nagad', 'rocket'] as const;

export type TPaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<TPaymentMethod, string> = {
  bkash: 'bKash',
  nagad: 'Nagad',
  rocket: 'Rocket',
};

export const PAYMENT_TYPES = ['cashout', 'sendMoney'] as const;

export type TPaymentType = (typeof PAYMENT_TYPES)[number];

export const DEFAULT_PAYMENT_TYPE: TPaymentType = 'cashout';

export const PAYMENT_TYPE_LABELS: Record<TPaymentType, string> = {
  cashout: 'Cash out',
  sendMoney: 'Send money',
};

export function resolvePaymentType(value?: string | null): TPaymentType {
  return value === 'sendMoney' ? 'sendMoney' : DEFAULT_PAYMENT_TYPE;
}
