import express from 'express';

import { USER_ROLE } from '../User/user.constant';
import { AdminControllers } from './admin.controller';
import { updateAdminValidationSchema ,giveSignupBonusValidation,updateUserStatusValidation, assignCustomerOfficerValidation, giveDepositValidation, giveWithdrawValidation} from './admin.validation';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';


const router = express.Router();

router.get(
  '/capabilities',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.viewer),
  AdminControllers.getCapabilities,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  AdminControllers.getAllAdmins,
);

router.get(
  '/dashboard/overview',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  AdminControllers.getDashboardOverview,
);

router.get(
  '/dashboard/advertiser-overview',
  auth(USER_ROLE.advertiser),
  AdminControllers.getAdvertiserDashboardOverview,
);

router.get(
  '/promotion-summary/:userId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  AdminControllers.getUserPromotionSummary
);

router.get(
  '/customerOfficers/my-users',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  AdminControllers.getMyUsers
);

router.get(
  '/user/successful-transaction/record/allusers',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  AdminControllers.getSuccessfulTransactionRecord
);

router.get(
  '/users/high-balance/allusers',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  AdminControllers.getUsersWithHighBalance
);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  AdminControllers.getSingleAdmin,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin),
  validateRequest(updateAdminValidationSchema),
  AdminControllers.updateAdmin,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin),
  AdminControllers.deleteAdmin,
);
router.post(
  '/users/:userId/give-signup-bonus',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(giveSignupBonusValidation),
  AdminControllers.giveSignupBonus
);
router.post(
  '/users/:userId/give-deposit',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(giveDepositValidation),
  AdminControllers.giveDepositToUser
);
router.post(
  '/users/:userId/give-withdraw',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(giveWithdrawValidation),
  AdminControllers.giveWithdrawToUser
);
router.get(
  '/users/:userId/wallets',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  AdminControllers.getUserWalletsForAdmin
);
router.patch(
  '/users/:userId/status',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(updateUserStatusValidation),
  AdminControllers.updateUserStatus
);
router.post(
  '/assign/users/:userId/assign-officer',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(assignCustomerOfficerValidation),
  AdminControllers.assignCustomerOfficer
);


export const AdminRoutes = router;
