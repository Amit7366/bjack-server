import { z } from 'zod';
import { MAX_CHAT_MESSAGE_LENGTH } from '../ChatRoom/chatRoom.constants';

export const createMessageZodSchema = z.object({
  body: z.object({
    senderId: z.string({ required_error: 'Sender ID is required' }),
    receiverId: z.string({ required_error: 'Receiver ID is required' }),
    content: z.string({ required_error: 'Content is required' }),
    roomId: z.string({ required_error: 'Room ID is required' }),
  }),
});

export const sendSupportMessageSchema = z.object({
  body: z.object({
    roomId: z.string().trim().min(1),
    content: z.string().trim().min(1).max(MAX_CHAT_MESSAGE_LENGTH),
  }),
});

export const roomIdParamSchema = z.object({
  params: z.object({
    roomId: z.string().trim().min(1),
  }),
});
