import express from 'express';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import * as HomeGamesController from './homeGames.controller';
import { createHomeGameSchema, updateHomeGameSchema } from './homeGames.validation';

const router = express.Router();
const adminAuth = auth(USER_ROLE.admin, USER_ROLE.superAdmin);

router.get('/', HomeGamesController.getHomeGamesHandler);

router.get('/manage', adminAuth, HomeGamesController.getHomeGamesManageHandler);

router.post(
  '/',
  adminAuth,
  validateRequest(createHomeGameSchema),
  HomeGamesController.createHomeGameHandler,
);

router.patch(
  '/:id',
  adminAuth,
  validateRequest(updateHomeGameSchema),
  HomeGamesController.updateHomeGameHandler,
);

router.delete('/:id', adminAuth, HomeGamesController.deleteHomeGameHandler);

export const HomeGamesRoutes = router;
