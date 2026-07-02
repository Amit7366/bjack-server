import express from 'express';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { AdvertiserControllers } from './advertiser.controller';
import {
  createAdvertiserValidationSchema,
  updateAdvertiserValidationSchema,
} from './advertiser.validation';

const router = express.Router();
const adminAuth = auth(USER_ROLE.admin, USER_ROLE.superAdmin);
const superAdminAuth = auth(USER_ROLE.superAdmin);
const advertiserAuth = auth(USER_ROLE.advertiser);

router.get(
  '/dashboard/overview',
  advertiserAuth,
  AdvertiserControllers.getAdvertiserDashboardOverview,
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
