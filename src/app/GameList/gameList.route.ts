// gameList.route.ts

import express from 'express';
import * as GameController from './gameList.controller';
import validateRequest from '../middleware/validateRequest';
import auth from '../middleware/auth';

import {
    createGameValidation,
    updateGameValidation,
} from './gameList.validation';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

// ✅ PUBLIC ROUTES (must come before "/:id")
router.get('/', GameController.getFilteredGamesHandler); // ?provider=jdb&category=slot OR ?vendor=awcv2_jili
router.get('/vendor', GameController.getVendorGamesHandler); // ?vendor=awcv2_jili,awcv2_pgsoft
router.get('/group-by-provider', GameController.groupByProviderHandler);
router.get('/group-by-category', GameController.groupByCategoryHandler);

// ✅ ADMIN-ONLY CRUD ROUTES (must be after public routes)
router.post(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(createGameValidation),
    GameController.createGameHandler
);

router.get(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    GameController.getGameByIdHandler
);

router.patch(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(updateGameValidation),
    GameController.updateGameHandler
);

router.delete(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    GameController.deleteGameHandler
);

export const GameListRoutes = router;
