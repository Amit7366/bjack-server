import express from 'express';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { KycControllers } from './kyc.controller';
import { kycUpload } from './kyc.upload';
import {
  listKycSubmissionsValidationSchema,
  submitKycValidationSchema,
  updateKycStatusValidationSchema,
} from './kyc.validation';

const router = express.Router();

router.post(
  '/submit',
  auth(USER_ROLE.user),
  kycUpload.fields([
    { name: 'front', maxCount: 1 },
    { name: 'back', maxCount: 1 },
    { name: 'selfie', maxCount: 1 },
  ]),
  validateRequest(submitKycValidationSchema),
  KycControllers.submitKyc,
);

router.get('/me', auth(USER_ROLE.user), KycControllers.getMyKyc);

router.get(
  '/submissions',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(listKycSubmissionsValidationSchema),
  KycControllers.listKycSubmissions,
);

router.get(
  '/submissions/:userId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  KycControllers.getKycSubmission,
);

router.patch(
  '/submissions/:userId/status',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(updateKycStatusValidationSchema),
  KycControllers.updateKycStatus,
);

export const KycRoutes = router;
