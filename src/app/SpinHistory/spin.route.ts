import { Router, Request, Response, NextFunction } from "express";
import { SpinController } from "./spin.controller";
import { claimSpinSchema, statusSpinSchema } from "./spin.validate";
import validateRequest from "../middleware/validateRequest";
import { USER_ROLE } from "../User/user.constant";
import auth from "../middleware/auth";

const router = Router();

/**
 * ✅ Helper: validate params with zod, using same project style (next(err))
 * Because your validateRequest middleware doesn't include params in its wrapped object.
 */
const validateParams =
  (schema: typeof statusSpinSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({ params: req.params });
      req.params = parsed.params as any;
      return next();
    } catch (err) {
      return next(err);
    }
  };

/// ✅ user endpoints (any logged-in user)
router.get(
  '/me/status',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  SpinController.meStatus
);

router.post(
  '/play',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  SpinController.play
);

router.get(
  '/status/:id',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  validateParams(statusSpinSchema),
  SpinController.status
);

router.post(
  '/claim',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(claimSpinSchema),
  SpinController.claim
);

export const SpinHistoryRoutes = router;
