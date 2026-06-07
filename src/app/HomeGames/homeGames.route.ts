import express from 'express';
import * as HomeGamesController from './homeGames.controller';

const router = express.Router();

router.get('/', HomeGamesController.getHomeGamesHandler);

export const HomeGamesRoutes = router;
