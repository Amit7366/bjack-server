import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import {
  callerFromRequest,
  getOrCreateSupportRoom,
  getRoomMessages,
  listManageRooms,
  markRoomRead,
  sendSupportMessage,
} from './supportChat.service';
import { SupportRoomSummary } from './chatRoom.interface';
import { IMessage } from '../Message/message.interface';

const requireUser = (req: Request) => {
  if (!req.user) {
    throw new Error('Unauthorized');
  }
  return callerFromRequest(req.user);
};

export const getMySupportRoom = catchAsync(async (req: Request, res: Response) => {
  const caller = requireUser(req);
  const result = await getOrCreateSupportRoom(caller);
  sendResponse<SupportRoomSummary>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Support room fetched successfully',
    data: result,
  });
});

export const getManageRooms = catchAsync(async (req: Request, res: Response) => {
  const caller = requireUser(req);
  const result = await listManageRooms(caller);
  sendResponse<SupportRoomSummary[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Chat rooms fetched successfully',
    data: result,
  });
});

export const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const caller = requireUser(req);
  const { roomId, content } = req.body as { roomId: string; content: string };
  const result = await sendSupportMessage(caller, roomId, content);
  sendResponse<IMessage>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Message sent successfully',
    data: result,
  });
});

export const getMessagesByRoom = catchAsync(async (req: Request, res: Response) => {
  const caller = requireUser(req);
  const { roomId } = req.params;
  const limit = req.query.limit ? Number(req.query.limit) : 100;
  const result = await getRoomMessages(caller, roomId, limit);
  sendResponse<IMessage[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Messages retrieved successfully',
    data: result,
  });
});

export const markRoomAsRead = catchAsync(async (req: Request, res: Response) => {
  const caller = requireUser(req);
  const { roomId } = req.params;
  await markRoomRead(caller, roomId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Messages marked as read',
    data: null,
  });
});
