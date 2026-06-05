// transaction.route.ts
import express from 'express';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import {
  coinWithdrawValidation,
  depositValidation,
  failAutoPayDepositSchema,
  verifyAutoPayDepositSchema,
  withdrawValidation,
} from './transaction.validation';
import { TransactionController } from './transaction.controller';

const router = express.Router();

router.post('/deposit/manual', auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user), validateRequest(depositValidation), TransactionController.createManualDeposit);

router.post(
  '/deposit/verify-autopay',
  auth(USER_ROLE.user),
  validateRequest(verifyAutoPayDepositSchema),
  TransactionController.verifyAutoPayDeposit
);

router.post(
  '/deposit/fail-autopay',
  auth(USER_ROLE.user),
  validateRequest(failAutoPayDepositSchema),
  TransactionController.failAutoPayDeposit
);

router.post('/withdraw/manual', auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user), validateRequest(withdrawValidation), TransactionController.createManualWithdraw);

router.patch('/withdraw/approve/:id', auth(USER_ROLE.admin, USER_ROLE.superAdmin), TransactionController.approveWithdraw);
router.patch(
  '/coin/withdraw',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  validateRequest(coinWithdrawValidation),
  TransactionController.approveCoinWithdraw
);


router.patch('/deposit/approve/:id', auth(USER_ROLE.admin, USER_ROLE.superAdmin), TransactionController.approveDeposit);

router.patch('/reject/:id', auth(USER_ROLE.admin, USER_ROLE.superAdmin), TransactionController.rejectWithdraw);

router.get('/all', auth(USER_ROLE.admin, USER_ROLE.superAdmin), TransactionController.getAllTransactions);
// 🔽 New route for user-based transaction list (by query param)
router.get(
  '/all/user',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  TransactionController.getUserTransactions
);

router.get('/me', auth(USER_ROLE.user), TransactionController.getUserTransactions);

router.get('/turnover/me', auth(USER_ROLE.user), TransactionController.getMyTurnover);

router.get('/balance/:userId', auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user), TransactionController.getBalance);
router.patch(
  '/storebalance/change/storeDbBalance',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  TransactionController.updateStoreDbBalance
);

export const TransactionRoutes = router;