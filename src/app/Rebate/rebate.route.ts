import express from 'express';
import auth from '../middleware/auth';
import { USER_ROLE } from '../User/user.constant';
import {
  claimDailyRebateHandler,
  getManualRebateHandler,
  getRebateHistoryHandler,
} from './rebate.controller';

const router = express.Router();

router.get('/manual', auth(USER_ROLE.user), getManualRebateHandler);
router.post('/claim', auth(USER_ROLE.user), claimDailyRebateHandler);
router.get('/history', auth(USER_ROLE.user), getRebateHistoryHandler);

export const RebateRoutes = router;
