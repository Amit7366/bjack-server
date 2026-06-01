import { Router } from 'express';
import { TransactionsController } from '../controllers/transactions.controller';
import { GameTxnRecordsController } from '../controllers/gametxnrecords.controller';
import { USER_ROLE } from '../../User/user.constant';
import auth from '../../middleware/auth';

const router = Router();
const tx = new TransactionsController();
const gameTxnController = new GameTxnRecordsController();
router.post('/api/transactions/ingest', tx.ingest);

/** After play: incremental sync from txserver for logged-in member only. */
router.post(
  '/api/transactions/sync-user',
  auth(USER_ROLE.user),
  tx.syncUser
);

router.get("/gametxnrecords/user-bets", auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user), gameTxnController.getUserBets);

export const gametxnrecordsRoute = router;
