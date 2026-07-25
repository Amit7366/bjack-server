import { Router } from 'express';
import { TransactionsController } from '../controllers/transactions.controller';
import { GameTxnRecordsController } from '../controllers/gametxnrecords.controller';
import { USER_ROLE } from '../../User/user.constant';
import auth from '../../middleware/auth';

const router = Router();
const tx = new TransactionsController();
const gameTxnController = new GameTxnRecordsController();
router.post('/api/transactions/ingest', tx.ingest);

router.get(
  '/api/ggr-balance',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  tx.getGgrBalance
);

router.post(
  '/api/transactions/sync-user',
  auth(USER_ROLE.user),
  tx.syncUser
);

router.post(
  '/api/transactions/sync-user/preview',
  auth(USER_ROLE.user),
  tx.previewSyncUser
);

router.post(
  '/api/transactions/sync-user/persist',
  auth(USER_ROLE.user),
  tx.persistSyncUser
);

router.get(
  '/api/transactions/sync-user/persist-status',
  auth(USER_ROLE.user),
  tx.persistSyncStatus
);

router.get(
  '/gametxnrecords/user-bets',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  gameTxnController.getUserBets
);

router.get(
  '/gametxnrecords/user-bets/me',
  auth(USER_ROLE.user),
  gameTxnController.getUserBets
);

export const gametxnrecordsRoute = router;
