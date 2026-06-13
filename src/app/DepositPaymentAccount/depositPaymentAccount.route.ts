import { Router } from 'express';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { DepositPaymentAccountControllers } from './depositPaymentAccount.controller';
import {
  createDepositPaymentAccountSchema,
  updateDepositPaymentAccountSchema,
} from './depositPaymentAccount.validation';

const router = Router();

router.get('/active', DepositPaymentAccountControllers.getActiveAccounts);

router.get(
  '/enabled',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  DepositPaymentAccountControllers.getEnabledAccounts,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  DepositPaymentAccountControllers.getAllAccounts,
);

router.post(
  '/',
  auth(USER_ROLE.superAdmin),
  validateRequest(createDepositPaymentAccountSchema),
  DepositPaymentAccountControllers.createAccount,
);

router.patch(
  '/:id/activate',
  auth(USER_ROLE.superAdmin),
  DepositPaymentAccountControllers.activateAccount,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin),
  validateRequest(updateDepositPaymentAccountSchema),
  DepositPaymentAccountControllers.updateAccount,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin),
  DepositPaymentAccountControllers.deleteAccount,
);

export const DepositPaymentAccountRoutes = router;
