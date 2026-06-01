import httpStatus from "http-status";
import config from "../config";
import { AutoPayConfig } from "./autopayConfig.model";
import { AutoPaySms } from "./autopaySms.model";
import { parsePaymentSms } from "./parsePaymentSms";
import AppError from "../errors/AppError";

const CONFIG_ID = "default";

function defaultIngestUrl(): string {
  const base = (config.base_url ?? `http://localhost:${config.port ?? 5000}`).replace(
    /\/$/,
    ""
  );
  return `${base}/api/v1/autopay/sms`;
}

async function getOrCreateConfig() {
  let doc = await AutoPayConfig.findOne({ key: CONFIG_ID }).lean();
  if (!doc) {
    doc = (
      await AutoPayConfig.create({
        key: CONFIG_ID,
        appWebhookUrl: defaultIngestUrl(),
      })
    ).toObject();
  }
  return doc;
}

const ingestSms = async (payload: {
  sender?: string;
  message: string;
  received_at?: string;
  title?: string;
  trxid?: string;
  amount?: number | string;
}) => {
  const parsed =
    payload.trxid && payload.amount != null
      ? {
          title: payload.title?.trim() || "SMS",
          trxid: String(payload.trxid).trim().toUpperCase(),
          amount:
            typeof payload.amount === "number"
              ? payload.amount
              : Number.parseFloat(String(payload.amount).replace(/,/g, "")),
        }
      : parsePaymentSms(payload.sender, payload.message);

  if (!parsed || !Number.isFinite(parsed.amount)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Could not parse payment SMS (need TrxID and amount in message)"
    );
  }

  const receivedAt = payload.received_at
    ? new Date(payload.received_at)
    : new Date();

  try {
    const saved = await AutoPaySms.create({
      title: parsed.title,
      trxid: parsed.trxid,
      amount: parsed.amount,
      sender: payload.sender ?? parsed.title,
      message: payload.message,
      receivedAt: Number.isNaN(receivedAt.getTime()) ? new Date() : receivedAt,
      status: "pending",
    });
    return saved;
  } catch (err: unknown) {
    const code = (err as { code?: number })?.code;
    if (code === 11000) {
      throw new AppError(
        httpStatus.CONFLICT,
        `Transaction ${parsed.trxid} was already recorded`
      );
    }
    throw err;
  }
};

const getConfig = async () => {
  const doc = await getOrCreateConfig();
  return {
    appWebhookUrl: doc.appWebhookUrl,
    ingestPath: "/api/v1/autopay/sms",
    defaultIngestUrl: defaultIngestUrl(),
  };
};

const updateConfig = async (appWebhookUrl: string) => {
  const doc = await AutoPayConfig.findOneAndUpdate(
    { key: CONFIG_ID },
    { key: CONFIG_ID, appWebhookUrl },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return doc;
};

const listRecentSms = async (limit = 20) => {
  return AutoPaySms.find().sort({ createdAt: -1 }).limit(limit).lean();
};

export const AutoPayService = {
  ingestSms,
  getConfig,
  updateConfig,
  listRecentSms,
  defaultIngestUrl,
};
