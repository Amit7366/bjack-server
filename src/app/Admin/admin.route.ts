import express from 'express';

import { USER_ROLE } from '../User/user.constant';
import { AdminControllers } from './admin.controller';
import { updateAdminValidationSchema ,giveSignupBonusValidation,updateUserStatusValidation, assignCustomerOfficerValidation} from './admin.validation';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';


const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  AdminControllers.getAllAdmins,
);

router.get(
  '/promotion-summary/:userId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  AdminControllers.getUserPromotionSummary
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


export const AdminRoutes = router;
