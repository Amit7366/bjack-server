import express from 'express';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import * as ExclusiveGamesController from './exclusiveGames.controller';
import {
  createExclusiveGameSchema,
  updateExclusiveGameSchema,
} from './exclusiveGames.validation';

const router = express.Router();
const adminAuth = auth(USER_ROLE.admin, USER_ROLE.superAdmin);

router.get('/', ExclusiveGamesController.getExclusiveGamesHandler);

router.get('/manage', adminAuth, ExclusiveGamesController.getExclusiveGamesManageHandler);

router.post(
  '/',
  adminAuth,
  validateRequest(createExclusiveGameSchema),
  ExclusiveGamesController.createExclusiveGameHandler,
);

router.patch(
  '/:id',
  adminAuth,
  validateRequest(updateExclusiveGameSchema),
  ExclusiveGamesController.updateExclusiveGameHandler,
);

router.delete('/:id', adminAuth, ExclusiveGamesController.deleteExclusiveGameHandler);

export const ExclusiveGamesRoutes = router;
