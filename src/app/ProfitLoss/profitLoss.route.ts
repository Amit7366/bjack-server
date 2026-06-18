import express from 'express';
import auth from '../middleware/auth';
import { USER_ROLE } from '../User/user.constant';
import { getPersonalReportHandler } from './profitLoss.controller';

const router = express.Router();

router.get('/report', auth(USER_ROLE.user), getPersonalReportHandler);

export const ProfitLossRoutes = router;
