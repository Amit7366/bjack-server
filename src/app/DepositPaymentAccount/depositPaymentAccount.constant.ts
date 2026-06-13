export const PAYMENT_METHODS = ['bkash', 'nagad', 'rocket'] as const;

export type TPaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<TPaymentMethod, string> = {
  bkash: 'bKash',
  nagad: 'Nagad',
  rocket: 'Rocket',
};
