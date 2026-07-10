import express from 'express';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import * as PasswordResetRequestController from './passwordResetRequest.controller';
import {
  createPasswordResetRequestValidationSchema,
  listPasswordResetRequestsValidationSchema,
  rejectPasswordResetRequestValidationSchema,
} from './passwordResetRequest.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(createPasswordResetRequestValidationSchema),
  PasswordResetRequestController.createPasswordResetRequest,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(listPasswordResetRequestsValidationSchema),
  PasswordResetRequestController.listPasswordResetRequests,
);

router.patch(
  '/:id/approve',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  PasswordResetRequestController.approvePasswordResetRequest,
);

router.patch(
  '/:id/reject',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(rejectPasswordResetRequestValidationSchema),
  PasswordResetRequestController.rejectPasswordResetRequest,
);

export const PasswordResetRequestRoutes = router;
