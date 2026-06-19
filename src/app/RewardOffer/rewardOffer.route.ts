import express from 'express';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import {
  claimRewardOfferHandler,
  createRewardOfferHandler,
  deleteRewardOfferHandler,
  getAllRewardOffersAdminHandler,
  getMemberRewardOffersHandler,
  updateRewardOfferHandler,
} from './rewardOffer.controller';
import { createRewardOfferSchema, updateRewardOfferSchema } from './rewardOffer.validation';

const router = express.Router();
const adminAuth = auth(USER_ROLE.admin, USER_ROLE.superAdmin);
const memberAuth = auth(USER_ROLE.user);

router.get('/manage', adminAuth, getAllRewardOffersAdminHandler);

router.post(
  '/',
  adminAuth,
  validateRequest(createRewardOfferSchema),
  createRewardOfferHandler,
);

router.patch(
  '/:id',
  adminAuth,
  validateRequest(updateRewardOfferSchema),
  updateRewardOfferHandler,
);

router.delete('/:id', adminAuth, deleteRewardOfferHandler);

router.get('/', memberAuth, getMemberRewardOffersHandler);
router.post('/:offerId/claim', memberAuth, claimRewardOfferHandler);

export const RewardOfferRoutes = router;
