import httpStatus from 'http-status';
import { Types } from 'mongoose';
import AppError from '../errors/AppError';
import { Message } from '../Message/message.model';
import { IMessage } from '../Message/message.interface';
import { User } from '../User/user.model';
import { USER_ROLE } from '../User/user.constant';
import { getIO } from '../socket/io';
import {
  buildSupportRoomId,
  isSupportRoomId,
  MAX_CHAT_MESSAGE_LENGTH,
  parseSupportMemberId,
} from './chatRoom.constants';
import { ChatRoom } from './chatRoom.model';
import { IChatRoom, SupportRoomSummary } from './chatRoom.interface';

export type ChatCaller = {
  objectId: string;
  id: string;
  role: string;
  userName?: string;
};

const sendRateLimit = new Map<string, number[]>();
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 60_000;

function assertRateLimit(objectId: string): void {
  const now = Date.now();
  const timestamps = (sendRateLimit.get(objectId) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  if (timestamps.length >= RATE_LIMIT_MAX) {
    throw new AppError(httpStatus.TOO_MANY_REQUESTS, 'Too many messages. Please wait a moment.');
  }
  timestamps.push(now);
  sendRateLimit.set(objectId, timestamps);
}

function sanitizeContent(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Message cannot be empty');
  }
  if (trimmed.length > MAX_CHAT_MESSAGE_LENGTH) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Message must be at most ${MAX_CHAT_MESSAGE_LENGTH} characters`,
    );
  }
  return trimmed;
}

async function resolveOfficerObjectId(officerId: string | null | undefined): Promise<Types.ObjectId | null> {
  if (!officerId) return null;
  const officer = await User.findOne({ id: officerId, role: { $in: [USER_ROLE.admin, USER_ROLE.superAdmin] } })
    .select('_id')
    .lean();
  if (!officer?._id) return null;
  return new Types.ObjectId(String(officer._id));
}

async function resolveDefaultSupportReceiver(): Promise<Types.ObjectId> {
  const superAdmin = await User.findOne({ role: USER_ROLE.superAdmin, isDeleted: { $ne: true } })
    .select('_id')
    .lean();
  if (superAdmin?._id) return new Types.ObjectId(String(superAdmin._id));

  const admin = await User.findOne({ role: USER_ROLE.admin, isDeleted: { $ne: true } })
    .select('_id')
    .lean();
  if (admin?._id) return new Types.ObjectId(String(admin._id));

  throw new AppError(httpStatus.SERVICE_UNAVAILABLE, 'Customer support is temporarily unavailable.');
}

async function getMemberUser(memberObjectId: string) {
  const member = await User.findById(memberObjectId).lean();
  if (!member || member.role !== USER_ROLE.user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Member not found');
  }
  return member;
}

async function ensureSupportRoom(memberObjectId: string) {
  const roomId = buildSupportRoomId(memberObjectId);
  const existing = await ChatRoom.findOne({ roomId });
  if (existing) return existing;

  const member = await getMemberUser(memberObjectId);
  const officerObjectId = await resolveOfficerObjectId(member.customerOfficerId ?? null);
  const members: Types.ObjectId[] = [new Types.ObjectId(memberObjectId)];
  if (officerObjectId) members.push(officerObjectId);

  return ChatRoom.create({
    roomId,
    members,
    memberObjectId: new Types.ObjectId(memberObjectId),
    assignedOfficerId: member.customerOfficerId ?? null,
    unreadForMember: 0,
    unreadForOfficer: 0,
    lastMessage: '',
    lastMessageAt: new Date(),
  });
}


export async function assertRoomAccess(caller: ChatCaller, roomId: string) {
  if (!isSupportRoomId(roomId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid support room');
  }

  const memberObjectId = parseSupportMemberId(roomId);
  if (!memberObjectId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid support room');
  }

  let room = await ChatRoom.findOne({ roomId });
  if (!room) {
    if (caller.role === USER_ROLE.user) {
      throw new AppError(httpStatus.NOT_FOUND, 'Chat room not found');
    }
    room = await ensureSupportRoom(memberObjectId);
  }

  if (caller.role === USER_ROLE.user) {
    if (caller.objectId !== memberObjectId) {
      throw new AppError(httpStatus.FORBIDDEN, 'You cannot access this chat room');
    }
    return room;
  }

  if (caller.role === USER_ROLE.superAdmin) {
    return room;
  }

  if (caller.role === USER_ROLE.admin) {
    const member = await getMemberUser(memberObjectId);
    if (member.customerOfficerId !== caller.id) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not assigned to this member');
    }
    return room;
  }

  throw new AppError(httpStatus.FORBIDDEN, 'Access denied');
}

export async function getOrCreateSupportRoom(caller: ChatCaller): Promise<SupportRoomSummary> {
  if (caller.role !== USER_ROLE.user) {
    throw new AppError(httpStatus.FORBIDDEN, 'Only members can open their support room');
  }

  const member = await getMemberUser(caller.objectId);
  const roomId = buildSupportRoomId(caller.objectId);
  const officerObjectId = await resolveOfficerObjectId(member.customerOfficerId ?? null);
  const members: Types.ObjectId[] = [new Types.ObjectId(caller.objectId)];
  if (officerObjectId) {
    members.push(officerObjectId);
  }

  let room = await ChatRoom.findOne({ roomId });
  if (!room) {
    room = await ChatRoom.create({
      roomId,
      members,
      memberObjectId: new Types.ObjectId(caller.objectId),
      assignedOfficerId: member.customerOfficerId ?? null,
      unreadForMember: 0,
      unreadForOfficer: 0,
      lastMessage: '',
      lastMessageAt: new Date(),
    });
  } else {
    room.memberObjectId = new Types.ObjectId(caller.objectId);
    room.assignedOfficerId = member.customerOfficerId ?? null;
    room.members = members;
    await room.save();
  }

  return toRoomSummary(room, member);
}

function toRoomSummary(
  room: {
    roomId: string;
    memberObjectId?: Types.ObjectId | string;
    assignedOfficerId?: string | null;
    unreadForMember?: number;
    unreadForOfficer?: number;
    lastMessage?: string;
    lastMessageAt?: Date;
  },
  member?: { _id?: unknown; id?: string; userName?: string; contactNo?: string },
): SupportRoomSummary {
  const memberObjectId = String(room.memberObjectId ?? parseSupportMemberId(room.roomId) ?? '');
  return {
    roomId: room.roomId,
    memberObjectId,
    assignedOfficerId: room.assignedOfficerId ?? null,
    officerAssigned: Boolean(room.assignedOfficerId),
    unreadForMember: room.unreadForMember ?? 0,
    unreadForOfficer: room.unreadForOfficer ?? 0,
    lastMessage: room.lastMessage ?? '',
    lastMessageAt: room.lastMessageAt ?? new Date(),
    member: member
      ? {
          objectId: String(member._id ?? memberObjectId),
          userName: member.userName ?? '',
          memberId: member.id ?? String(member._id ?? ''),
          contactNo: member.contactNo ?? '',
        }
      : undefined,
  };
}

export async function listManageRooms(caller: ChatCaller): Promise<SupportRoomSummary[]> {
  if (caller.role !== USER_ROLE.admin && caller.role !== USER_ROLE.superAdmin) {
    throw new AppError(httpStatus.FORBIDDEN, 'Access denied');
  }

  const filter: Record<string, unknown> = {
    roomId: { $regex: '^support:' },
  };

  if (caller.role === USER_ROLE.admin) {
    filter.assignedOfficerId = caller.id;
  }

  const rooms = await ChatRoom.find(filter).sort({ lastMessageAt: -1 }).lean();
  const result: SupportRoomSummary[] = rooms.map((room) => {
    const memberObjectId = String(room.memberObjectId ?? parseSupportMemberId(room.roomId) ?? '');
    return toRoomSummary(room, undefined);
  });

  const existingMemberIds = new Set(result.map((r) => r.memberObjectId));

  if (caller.role === USER_ROLE.admin) {
    const assigned = await User.find({ customerOfficerId: caller.id, role: USER_ROLE.user })
      .select('_id id userName contactNo customerOfficerId')
      .lean();

    for (const user of assigned) {
      const oid = String(user._id);
      if (existingMemberIds.has(oid)) continue;
      result.push({
        roomId: buildSupportRoomId(oid),
        memberObjectId: oid,
        assignedOfficerId: caller.id,
        officerAssigned: true,
        unreadForMember: 0,
        unreadForOfficer: 0,
        lastMessage: '',
        lastMessageAt: new Date(0),
        member: {
          objectId: oid,
          userName: user.userName ?? '',
          memberId: user.id ?? oid,
          contactNo: user.contactNo ?? '',
        },
      });
    }
  } else {
    const memberIds = result.map((r) => r.memberObjectId).filter(Boolean);
    const members = await User.find({ _id: { $in: memberIds } })
      .select('_id id userName contactNo customerOfficerId')
      .lean();
    const memberMap = new Map(members.map((m) => [String(m._id), m]));
    for (let i = 0; i < result.length; i += 1) {
      const member = memberMap.get(result[i].memberObjectId);
      if (member) {
        result[i] = {
          ...result[i],
          member: {
            objectId: String(member._id),
            userName: member.userName ?? '',
            memberId: member.id ?? String(member._id),
            contactNo: member.contactNo ?? '',
          },
        };
      }
    }
  }

  if (caller.role === USER_ROLE.admin) {
    return result.sort(
      (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
    );
  }

  const memberIds = result.map((r) => r.memberObjectId).filter(Boolean);
  const members = await User.find({ _id: { $in: memberIds } })
    .select('_id id userName contactNo customerOfficerId')
    .lean();
  const memberMap = new Map(members.map((m) => [String(m._id), m]));

  return result
    .map((entry) => {
      const member = memberMap.get(entry.memberObjectId);
      if (!member) return entry;
      return {
        ...entry,
        member: {
          objectId: String(member._id),
          userName: member.userName ?? '',
          memberId: member.id ?? String(member._id),
          contactNo: member.contactNo ?? '',
        },
      };
    })
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
}

export async function sendSupportMessage(
  caller: ChatCaller,
  roomId: string,
  content: string,
): Promise<IMessage> {
  assertRateLimit(caller.objectId);
  const sanitized = sanitizeContent(content);
  const room = await assertRoomAccess(caller, roomId);
  const memberObjectId = parseSupportMemberId(roomId)!;
  const member = await getMemberUser(memberObjectId);

  let senderId: Types.ObjectId;
  let receiverId: Types.ObjectId;

  if (caller.role === USER_ROLE.user) {
    senderId = new Types.ObjectId(caller.objectId);
    const officerObjectId = await resolveOfficerObjectId(member.customerOfficerId ?? null);
    receiverId = officerObjectId ?? (await resolveDefaultSupportReceiver());
  } else {
    senderId = new Types.ObjectId(caller.objectId);
    receiverId = new Types.ObjectId(memberObjectId);
  }

  const message = await Message.create({
    senderId,
    receiverId,
    content: sanitized,
    roomId,
    isRead: false,
  });

  room.lastMessage = sanitized;
  room.lastMessageAt = new Date();
  room.assignedOfficerId = member.customerOfficerId ?? room.assignedOfficerId ?? null;
  room.memberObjectId = new Types.ObjectId(memberObjectId);

  const officerObjectId = await resolveOfficerObjectId(member.customerOfficerId ?? null);
  const members: Types.ObjectId[] = [new Types.ObjectId(memberObjectId)];
  if (officerObjectId) members.push(officerObjectId);
  room.members = members;

  if (caller.role === USER_ROLE.user) {
    room.unreadForOfficer = (room.unreadForOfficer ?? 0) + 1;
  } else {
    room.unreadForMember = (room.unreadForMember ?? 0) + 1;
  }

  await room.save();

  const io = getIO();
  if (io) {
    io.to(`room:${roomId}`).emit('new_message', message);
  }

  return message.toObject() as IMessage;
}

export async function getRoomMessages(
  caller: ChatCaller,
  roomId: string,
  limit = 100,
): Promise<IMessage[]> {
  await assertRoomAccess(caller, roomId);
  return Message.find({ roomId }).sort({ createdAt: 1 }).limit(limit).lean();
}

export async function markRoomRead(caller: ChatCaller, roomId: string): Promise<void> {
  const room = await assertRoomAccess(caller, roomId);

  if (caller.role === USER_ROLE.user) {
    await Message.updateMany(
      { roomId, receiverId: new Types.ObjectId(caller.objectId), isRead: false },
      { isRead: true },
    );
    room.unreadForMember = 0;
  } else {
    await Message.updateMany(
      { roomId, receiverId: new Types.ObjectId(caller.objectId), isRead: false },
      { isRead: true },
    );
    room.unreadForOfficer = 0;
  }

  await room.save();
}

export function callerFromRequest(user: {
  objectId: string;
  id: string;
  role: string;
  userName?: string;
}): ChatCaller {
  return {
    objectId: String(user.objectId),
    id: String(user.id),
    role: user.role,
    userName: user.userName,
  };
}
