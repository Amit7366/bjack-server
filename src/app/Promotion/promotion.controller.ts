import httpStatus from "http-status";
import catchAsync from "../utilis/catchAsync";
import sendResponse from "../utilis/sendResponse";
import { PromotionService } from "./promotion.service";

const getDepositPromotions = catchAsync(async (_req, res) => {
  const list = PromotionService.getDepositPromotions();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Deposit promotions fetched",
    data: list,
  });
});

export const PromotionController = {
  getDepositPromotions,
};
