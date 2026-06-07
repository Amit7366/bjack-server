import express from 'express';
import * as ExclusiveGamesController from './exclusiveGames.controller';

const router = express.Router();

router.get('/', ExclusiveGamesController.getExclusiveGamesHandler);

export const ExclusiveGamesRoutes = router;
