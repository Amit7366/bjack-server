export const SUPPORT_ROOM_PREFIX = 'support:';

export const MAX_CHAT_MESSAGE_LENGTH = 2000;

export function buildSupportRoomId(memberObjectId: string): string {
  return `${SUPPORT_ROOM_PREFIX}${memberObjectId}`;
}

export function parseSupportMemberId(roomId: string): string | null {
  if (!roomId.startsWith(SUPPORT_ROOM_PREFIX)) return null;
  const memberId = roomId.slice(SUPPORT_ROOM_PREFIX.length);
  return memberId || null;
}

export function isSupportRoomId(roomId: string): boolean {
  return roomId.startsWith(SUPPORT_ROOM_PREFIX);
}
