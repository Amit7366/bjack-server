import httpStatus from "http-status";
import catchAsync from "../utilis/catchAsync";
import sendResponse from "../utilis/sendResponse";
import { AutoPayService } from "./autopay.service";

const ingestSms = catchAsync(async (req, res) => {
  const result = await AutoPayService.ingestSms(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "SMS payment recorded",
    data: result,
  });
});

const getConfig = catchAsync(async (req, res) => {
  const result = await AutoPayService.getConfig();
  const host = req.get("host");
  const currentIngestUrl = host
    ? `${req.protocol}://${host}${result.ingestPath}`
    : result.defaultIngestUrl;

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "AutoPay webhook config",
    data: {
      ...result,
      currentIngestUrl,
      appWebhookUrl: currentIngestUrl,
    },
  });
});

const updateConfig = catchAsync(async (req, res) => {
  const result = await AutoPayService.updateConfig(req.body.appWebhookUrl);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Webhook URL updated",
    data: result,
  });
});

const listSms = catchAsync(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const result = await AutoPayService.listRecentSms(limit);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Recent AutoPay SMS records",
    data: result,
  });
});

export const AutoPayController = {
  ingestSms,
  getConfig,
  updateConfig,
  listSms,
};
