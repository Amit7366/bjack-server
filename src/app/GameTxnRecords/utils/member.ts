/** Matches legacy sbm* and current bkb* member ids embedded in provider member_account. */
const MEMBER_ID_SEGMENT = /^(?:sbm|bkb)\d+$/i;

/** Same default as client NEXT_PUBLIC_GAME_PLAYER_PREFIX / game-launch.ts */
const PLAYER_PREFIX =
  (typeof process !== 'undefined' && process.env.GAME_LAUNCH_PLAYER_PREFIX) || 'h94044';

/**
 * Extract member id from either:
 *   - h94044_bkb47700_b  → bkb47700 (underscore middle segment)
 *   - h94044bkb47700     → bkb47700 (strip player prefix)
 */
export const extractSbmId = (member: string): string | null => {
  const trimmed = member.trim();
  if (!trimmed) return null;

  const piece = trimmed.split('_').find((p) => MEMBER_ID_SEGMENT.test(p));
  if (piece) return piece.toLowerCase();

  const prefix = PLAYER_PREFIX.toLowerCase();
  const lower = trimmed.toLowerCase();
  if (lower.startsWith(prefix) && lower.length > prefix.length) {
    const rest = lower.slice(prefix.length);
    if (MEMBER_ID_SEGMENT.test(rest)) return rest;
  }

  return null;
};

export const isMemberId = (id: string): boolean => MEMBER_ID_SEGMENT.test(id.trim());

export const parseUtc = (s: string): Date => {
  // "YYYY-MM-DD HH:mm:ss" -> ISO
  return new Date(`${s.replace(' ', 'T')}Z`);
};
