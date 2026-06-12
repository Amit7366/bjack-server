import express from 'express';
import auth from '../middleware/auth';
import { USER_ROLE } from '../User/user.constant';
import {
  claimMemberBonusRewardHandler,
  getMemberBonusRewardStatusHandler,
} from './memberBonusReward.controller';

const router = express.Router();

router.get('/status', auth(USER_ROLE.user), getMemberBonusRewardStatusHandler);
router.post('/claim', auth(USER_ROLE.user), claimMemberBonusRewardHandler);

export const MemberBonusRewardRoutes = router;
