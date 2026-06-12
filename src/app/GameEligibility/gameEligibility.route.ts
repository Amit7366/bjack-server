import { Router } from 'express';
import auth from '../middleware/auth';
import { USER_ROLE } from '../User/user.constant';
import { GameEligibilityController } from './gameEligibility.controller';

const router = Router();

router.get(
  '/check',
  auth(USER_ROLE.user),
  GameEligibilityController.checkLaunch
);

router.get(
  '/active',
  auth(USER_ROLE.user),
  GameEligibilityController.getActiveRestrictions
);

export const GameEligibilityRoutes = router;
