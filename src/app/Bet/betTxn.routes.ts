import express from 'express';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { adminBetHistorySchema, userBetHistorySchema } from './betTxn.validation';
import { BetTxnController } from './betTxn.controller';


const router = express.Router();

/**
 * USER: Bet history (requires user auth).
 * - userId comes via query params (?userId=...)
 * - We enforce that a normal user can only fetch their own history.
 */
router.get(
  '/history',
  auth(USER_ROLE.user),
  validateRequest(userBetHistorySchema),
  BetTxnController.getUserBetHistory
);

router.get(
  '/history/me',
  auth(USER_ROLE.user),
  validateRequest(userBetHistorySchema),
  BetTxnController.getUserBetHistory
);

/**
 * ADMIN: All users bet history with totals, latest-first.
 */
router.get(
  '/admin/history',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(adminBetHistorySchema),
  BetTxnController.adminGetAllBetHistory
);

export const BetTxnRoutes = router;
