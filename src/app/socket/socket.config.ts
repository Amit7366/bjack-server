import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config';
import { CustomJwtPayload } from '../Auth/CustomJwtPayload';
import { USER_ROLE } from '../User/user.constant';
import {
  buildSupportRoomId,
  isSupportRoomId,
  parseSupportMemberId,
} from '../ChatRoom/chatRoom.constants';
import {
  callerFromRequest,
  markRoomRead,
  sendSupportMessage,
} from '../ChatRoom/supportChat.service';
import { User } from '../User/user.model';

interface IUserSocket extends Socket {
  userId?: string;
  userRole?: string;
  userAdminId?: string;
}

const onlineUsers = new Map<string, string>();

export const setupSocketIO = (io: Server) => {
  io.use((socket: IUserSocket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Auth token missing'));
      const decoded = jwt.verify(token, config.jwt_access_secret as string) as CustomJwtPayload;
      if (!decoded.objectId) return next(new Error('Invalid token payload'));
      socket.userId = String(decoded.objectId);
      socket.userRole = decoded.role;
      socket.userAdminId = String(decoded.id);
      next();
    } catch (_err) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', async (socket: IUserSocket) => {
    if (!socket.userId) return socket.disconnect(true);

    onlineUsers.set(socket.userId, socket.id);
    socket.join(socket.userId);

    if (socket.userRole === USER_ROLE.user) {
      const roomId = buildSupportRoomId(socket.userId);
      socket.join(`room:${roomId}`);
    } else if (socket.userRole === USER_ROLE.admin || socket.userRole === USER_ROLE.superAdmin) {
      const filter =
        socket.userRole === USER_ROLE.superAdmin
          ? { roomId: { $regex: '^support:' } }
          : { assignedOfficerId: socket.userAdminId };
      const { ChatRoom } = await import('../ChatRoom/chatRoom.model');
      const rooms = await ChatRoom.find(filter).select('roomId').lean();
      for (const room of rooms) {
        socket.join(`room:${room.roomId}`);
      }
    }

    io.emit('online_users', Array.from(onlineUsers.keys()));

    socket.on('join_support_room', async (roomId: string) => {
      if (!isSupportRoomId(roomId)) return;
      try {
        const caller = callerFromRequest({
          objectId: socket.userId!,
          id: socket.userAdminId ?? socket.userId!,
          role: socket.userRole!,
        });
        const memberObjectId = parseSupportMemberId(roomId);
        if (!memberObjectId) return;

        if (caller.role === USER_ROLE.user && caller.objectId !== memberObjectId) return;
        if (caller.role === USER_ROLE.admin) {
          const member = await User.findById(memberObjectId).select('customerOfficerId').lean();
          if (member?.customerOfficerId !== caller.id) return;
        }

        socket.join(`room:${roomId}`);
      } catch {
        /* ignore unauthorized join */
      }
    });

    socket.on('private_message', async (payload: { roomId: string; content: string }) => {
      try {
        const caller = callerFromRequest({
          objectId: socket.userId!,
          id: socket.userAdminId ?? socket.userId!,
          role: socket.userRole!,
        });
        const newMsg = await sendSupportMessage(caller, payload.roomId, payload.content);
        socket.emit('message_sent', newMsg);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to send message';
        socket.emit('message_error', { message });
      }
    });

    socket.on('typing', (data: { roomId: string }) => {
      if (!data?.roomId) return;
      socket.to(`room:${data.roomId}`).emit('typing', { from: socket.userId, roomId: data.roomId });
    });

    socket.on('stop_typing', (data: { roomId: string }) => {
      if (!data?.roomId) return;
      socket.to(`room:${data.roomId}`).emit('stop_typing', { from: socket.userId, roomId: data.roomId });
    });

    socket.on('mark_as_read', async (roomId: string) => {
      try {
        const caller = callerFromRequest({
          objectId: socket.userId!,
          id: socket.userAdminId ?? socket.userId!,
          role: socket.userRole!,
        });
        await markRoomRead(caller, roomId);
      } catch {
        /* ignore */
      }
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(socket.userId!);
      io.emit('online_users', Array.from(onlineUsers.keys()));
    });
  });
};
