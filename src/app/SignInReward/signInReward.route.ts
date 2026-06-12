import express from 'express';
import auth from '../middleware/auth';
import { USER_ROLE } from '../User/user.constant';
import {
  claimSignInRewardHandler,
  getSignInRewardStatusHandler,
} from './signInReward.controller';

const router = express.Router();

router.get('/status', auth(USER_ROLE.user), getSignInRewardStatusHandler);
router.post('/claim', auth(USER_ROLE.user), claimSignInRewardHandler);

export const SignInRewardRoutes = router;
