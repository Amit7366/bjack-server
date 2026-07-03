import express from 'express';
import auth from '../middleware/auth';
import { USER_ROLE } from '../User/user.constant';
import { listMissionsHandler, getMissionSummaryHandler } from './mission.controller';

const router = express.Router();

router.get('/summary', auth(USER_ROLE.user), getMissionSummaryHandler);
router.get('/', auth(USER_ROLE.user), listMissionsHandler);

export const MissionRoutes = router;
