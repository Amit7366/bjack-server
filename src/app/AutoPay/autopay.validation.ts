import { z } from "zod";

export const ingestSmsSchema = z.object({
  body: z
    .object({
      sender: z.string().optional(),
      message: z.string().min(1, "message is required"),
      received_at: z.string().optional(),
      title: z.string().optional(),
      trxid: z.string().optional(),
      amount: z.union([z.number(), z.string()]).optional(),
    })
    .passthrough(),
});

export const updateConfigSchema = z.object({
  body: z.object({
    appWebhookUrl: z.string().url("appWebhookUrl must be a valid URL"),
  }),
});
