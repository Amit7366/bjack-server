import express from 'express';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { SuggestionControllers } from './suggestion.controller';
import { suggestionUpload } from './suggestion.upload';
import {
  listSuggestionsValidationSchema,
  submitSuggestionValidationSchema,
  updateSuggestionStatusValidationSchema,
} from './suggestion.validation';

const router = express.Router();

router.get('/captcha', auth(USER_ROLE.user), SuggestionControllers.getCaptcha);

router.post(
  '/',
  auth(USER_ROLE.user),
  suggestionUpload.single('image'),
  validateRequest(submitSuggestionValidationSchema),
  SuggestionControllers.submitSuggestion,
);

router.get(
  '/manage',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(listSuggestionsValidationSchema),
  SuggestionControllers.listSuggestions,
);

router.get(
  '/manage/:suggestionId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  SuggestionControllers.getSuggestion,
);

router.patch(
  '/manage/:suggestionId/status',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(updateSuggestionStatusValidationSchema),
  SuggestionControllers.updateSuggestionStatus,
);

export const SuggestionRoutes = router;
