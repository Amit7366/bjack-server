import express from 'express';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { AdvertiserControllers } from './advertiser.controller';
import { PartnerCommissionControllers } from '../PartnerCommission/partnerCommission.controller';
import {
  createAdvertiserValidationSchema,
  updateAdvertiserValidationSchema,
} from './advertiser.validation';
import {
  createPartnerWithdrawRequestSchema,
  rejectPartnerWithdrawRequestSchema,
  updateCommissionSettingsSchema,
} from '../PartnerCommission/partnerCommission.validation';

const router = express.Router();
const adminAuth = auth(USER_ROLE.admin, USER_ROLE.superAdmin);
const superAdminAuth = auth(USER_ROLE.superAdmin);
const advertiserAuth = auth(USER_ROLE.advertiser);

router.get(
  '/dashboard/overview',
  advertiserAuth,
  AdvertiserControllers.getAdvertiserDashboardOverview,
);

router.get('/me/wallet', advertiserAuth, PartnerCommissionControllers.getMyWallet);
router.get(
  '/me/commission-ledger',
  advertiserAuth,
  PartnerCommissionControllers.getMyCommissionLedger,
);
router.post(
  '/me/withdraw-requests',
  advertiserAuth,
  validateRequest(createPartnerWithdrawRequestSchema),
  PartnerCommissionControllers.createMyWithdrawRequest,
);
router.get(
  '/me/withdraw-requests',
  advertiserAuth,
  PartnerCommissionControllers.getMyWithdrawRequests,
);

router.get(
  '/settings/commission',
  adminAuth,
  PartnerCommissionControllers.getCommissionSettings,
);
router.patch(
  '/settings/commission',
  adminAuth,
  validateRequest(updateCommissionSettingsSchema),
  PartnerCommissionControllers.updateCommissionSettings,
);

router.get(
  '/withdraw-requests',
  adminAuth,
  PartnerCommissionControllers.getAllWithdrawRequests,
);
router.patch(
  '/withdraw-requests/:id/approve',
  adminAuth,
  PartnerCommissionControllers.approveWithdrawRequest,
);
router.patch(
  '/withdraw-requests/:id/reject',
  adminAuth,
  validateRequest(rejectPartnerWithdrawRequestSchema),
  PartnerCommissionControllers.rejectWithdrawRequest,
);

router.post(
  '/',
  adminAuth,
  validateRequest(createAdvertiserValidationSchema),
  AdvertiserControllers.createAdvertiser,
);

router.get('/', adminAuth, AdvertiserControllers.getAllAdvertisers);

router.get('/:id', adminAuth, AdvertiserControllers.getSingleAdvertiser);

router.patch(
  '/:id',
  adminAuth,
  validateRequest(updateAdvertiserValidationSchema),
  AdvertiserControllers.updateAdvertiser,
);

router.delete('/:id', superAdminAuth, AdvertiserControllers.deleteAdvertiser);

export const AdvertiserRoutes = router;
