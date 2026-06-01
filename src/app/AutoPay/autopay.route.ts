import express from "express";
import validateRequest from "../middleware/validateRequest";
import { AutoPayController } from "./autopay.controller";
import { verifyAutoPaySecret } from "./autopay.middleware";
import { ingestSmsSchema, updateConfigSchema } from "./autopay.validation";

export const autopayRoute = express.Router();

autopayRoute.use(express.urlencoded({ extended: true, limit: "32kb" }));
autopayRoute.use(express.json({ limit: "32kb" }));

/** PipraPay app POSTs parsed SMS JSON here. */
autopayRoute.post(
  "/sms",
  verifyAutoPaySecret,
  validateRequest(ingestSmsSchema),
  AutoPayController.ingestSms
);

/** App reads the webhook URL to configure locally. */
autopayRoute.get("/config", AutoPayController.getConfig);

autopayRoute.put(
  "/config",
  verifyAutoPaySecret,
  validateRequest(updateConfigSchema),
  AutoPayController.updateConfig
);

autopayRoute.get("/sms", verifyAutoPaySecret, AutoPayController.listSms);
