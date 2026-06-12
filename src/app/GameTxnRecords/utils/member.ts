/** Matches legacy sbm* and current bkb* member ids embedded in provider member_account. */
const MEMBER_ID_SEGMENT = /^(?:sbm|bkb)\d+$/i;

export const extractSbmId = (member: string): string | null => {
  const piece = member.split('_').find((p) => MEMBER_ID_SEGMENT.test(p));
  return piece ? piece.toLowerCase() : null;
};

export const isMemberId = (id: string): boolean => MEMBER_ID_SEGMENT.test(id.trim());

export const parseUtc = (s: string): Date => {
  // "YYYY-MM-DD HH:mm:ss" -> ISO
  return new Date(`${s.replace(' ', 'T')}Z`);
};
