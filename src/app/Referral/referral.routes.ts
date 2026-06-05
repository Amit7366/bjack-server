import { Router } from 'express';
import auth from '../middleware/auth';
import { USER_ROLE } from '../User/user.constant';
import { getMyReferralSummaryHandler, referralSignupHandler } from './referral.controller';

const router = Router();

router.get('/me', auth(USER_ROLE.user), getMyReferralSummaryHandler);
router.post('/track', referralSignupHandler);

export default router;