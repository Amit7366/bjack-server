// gameList.route.ts

import express from 'express';
import * as GameController from './gameList.controller';
import validateRequest from '../middleware/validateRequest';
import auth from '../middleware/auth';

import { createGameValidation, updateGameValidation } from './gameList.validation';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();
const adminAuth = auth(USER_ROLE.admin, USER_ROLE.superAdmin);

// ✅ PUBLIC ROUTES (must come before "/:id")
router.get('/', GameController.getFilteredGamesHandler);
router.get('/vendor', GameController.getVendorGamesHandler);
router.get('/group-by-provider', GameController.groupByProviderHandler);
router.get('/group-by-category', GameController.groupByCategoryHandler);

router.get('/manage', adminAuth, GameController.getAllCatalogGamesHandler);

// ✅ ADMIN-ONLY CRUD ROUTES (must be after public routes)
router.post(
    '/',
    adminAuth,
    validateRequest(createGameValidation),
    GameController.createGameHandler
);

router.get(
    '/:id',
    adminAuth,
    GameController.getGameByIdHandler
);

router.patch(
    '/:id',
    adminAuth,
    validateRequest(updateGameValidation),
    GameController.updateGameHandler
);

router.delete(
    '/:id',
    adminAuth,
    GameController.deleteGameHandler
);

export const GameListRoutes = router;
