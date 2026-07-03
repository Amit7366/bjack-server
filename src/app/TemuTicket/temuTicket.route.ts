import express from 'express';
import auth from '../middleware/auth';
import { USER_ROLE } from '../User/user.constant';
import {
  claimTemuRewardHandler,
  getTemuTicketHistoryHandler,
  getTemuTicketStatusHandler,
} from './temuTicket.controller';

const router = express.Router();
const memberAuth = auth(USER_ROLE.user);

router.get('/status', memberAuth, getTemuTicketStatusHandler);
router.get('/history', memberAuth, getTemuTicketHistoryHandler);
router.post('/claim', memberAuth, claimTemuRewardHandler);

export const TemuTicketRoutes = router;
