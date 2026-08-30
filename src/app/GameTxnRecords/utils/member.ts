/** Matches legacy sbm/bkb and current rajab ids in provider member_account. */
const MEMBER_ID_SEGMENT = /^(?:sbm|bkb|rajab)\d+$/i;

function playerPrefixes(): string[] {
  const fromEnv = [
    process.env.GAME_LAUNCH_PLAYER_PREFIX,
    process.env.GAME_API_PREFIX,
  ];
  const prefixes = [...fromEnv, 'h94044']
    .map((p) => String(p ?? '').trim().toLowerCase())
    .filter(Boolean);
  return [...new Set(prefixes)];
}

/**
 * Extract member id from either:
 *   - rajab47000
 *   - 6PXTH_rajab47000 / h94044_bkb47700_b
 *   - 6PXTHrajab47000 / h94044bkb47700
 */
export const extractSbmId = (member: string): string | null => {
  const trimmed = member.trim();
  if (!trimmed) return null;

  const piece = trimmed.split('_').find((p) => MEMBER_ID_SEGMENT.test(p));
  if (piece) return piece.toLowerCase();

  const lower = trimmed.toLowerCase();
  for (const prefix of playerPrefixes()) {
    if (lower.startsWith(prefix) && lower.length > prefix.length) {
      const rest = lower.slice(prefix.length).replace(/^_+/, '');
      if (MEMBER_ID_SEGMENT.test(rest)) return rest;
    }
  }

  return null;
};

export const isMemberId = (id: string): boolean => MEMBER_ID_SEGMENT.test(id.trim());

export const parseUtc = (s: string): Date => {
  // "YYYY-MM-DD HH:mm:ss" -> ISO
  return new Date(`${s.replace(' ', 'T')}Z`);
};
