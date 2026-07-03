import express from 'express';
import auth from '../middleware/auth';
import { USER_ROLE } from '../User/user.constant';
import {
  claimRescueFundHandler,
  getRescueFundStatusHandler,
  getRescueFundSummaryHandler,
} from './rescueFund.controller';

const router = express.Router();
const memberAuth = auth(USER_ROLE.user);

router.get('/summary', memberAuth, getRescueFundSummaryHandler);
router.get('/:variant', memberAuth, getRescueFundStatusHandler);
router.post('/:variant/claim', memberAuth, claimRescueFundHandler);

export const RescueFundRoutes = router;
