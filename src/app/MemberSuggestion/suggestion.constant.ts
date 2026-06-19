export const SUGGESTION_CATEGORIES = [
  'deposit',
  'withdrawal',
  'game',
  'customer_service',
] as const;

export type TSuggestionCategory = (typeof SUGGESTION_CATEGORIES)[number];

export const SUGGESTION_STATUSES = ['pending', 'reviewed'] as const;

export type TSuggestionStatus = (typeof SUGGESTION_STATUSES)[number];

export const MAX_SUGGESTION_MESSAGE_LENGTH = 500;
export const MAX_SUGGESTION_FILE_BYTES = 5 * 1024 * 1024;
