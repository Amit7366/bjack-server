import { Router } from "express";
import auth from "../middleware/auth";
import { USER_ROLE } from "../User/user.constant";
import { PromotionController } from "./promotion.controller";

const router = Router();

router.get("/deposit/public", PromotionController.getPublicDepositPromotions);

router.get(
  "/deposit",
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  PromotionController.getDepositPromotions
);

export const PromotionRoutes = router;
