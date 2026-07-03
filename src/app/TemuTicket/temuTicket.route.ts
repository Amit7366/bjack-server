import express from 'express';
import auth from '../middleware/auth';
import { USER_ROLE } from '../User/user.constant';
import { getTemuTicketHistoryHandler } from './temuTicket.controller';

const router = express.Router();

router.get('/history', auth(USER_ROLE.user), getTemuTicketHistoryHandler);

export const TemuTicketRoutes = router;
