import express from 'express';
import { USER_ROLE } from '../User/user.constant';
import { createMessage, getMessages } from './message.controller';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import {
  getMessagesByRoom,
  markRoomAsRead,
  sendMessage,
} from '../ChatRoom/supportChat.controller';
import { roomIdParamSchema, sendSupportMessageSchema } from './message.validation';

const router = express.Router();

router.post(
  '/send',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  validateRequest(sendSupportMessageSchema),
  sendMessage,
);
router.get(
  '/room/:roomId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  validateRequest(roomIdParamSchema),
  getMessagesByRoom,
);
router.patch(
  '/room/:roomId/read',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  validateRequest(roomIdParamSchema),
  markRoomAsRead,
);

// Legacy routes kept for backward compatibility
router.post('/createMessage', auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user), createMessage);
router.get('/getMessages/:roomId', auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user), getMessages);

export const MessageRoutes = router;
