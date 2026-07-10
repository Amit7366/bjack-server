export const PASSWORD_RESET_STATUSES = ['pending', 'approved', 'rejected'] as const;

export type TPasswordResetStatus = (typeof PASSWORD_RESET_STATUSES)[number];
