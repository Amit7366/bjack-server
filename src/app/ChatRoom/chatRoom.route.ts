import express from 'express';
import { USER_ROLE } from '../User/user.constant';
import { getMyChatRooms } from './chatRoom.controller';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { getManageRooms, getMySupportRoom } from './supportChat.controller';

const router = express.Router();

router.get('/my', auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin), getMyChatRooms);
router.get('/support/my-room', auth(USER_ROLE.user), getMySupportRoom);
router.get('/manage', auth(USER_ROLE.admin, USER_ROLE.superAdmin), getManageRooms);

export const ChatRoomRoutes = router;
