export type ParsedPaymentSms = {
  title: string;
  trxid: string;
  amount: number;
};

/** bKash: TrxID — Nagad: TxnID */
const TXN_ID_RE = /(?:trx|txn)\s*id[:\s]*([A-Za-z0-9]+)/i;
/** Nagad: Amount: Tk 16290.00 */
const NAGAD_AMOUNT_RE = /amount:\s*tk\.?\s*([\d,]+(?:\.\d{1,2})?)/i;
/** bKash: You have received Tk 500.00 */
const BKASH_AMOUNT_RE =
  /(?:received|sent|payment of|cash\s*(?:in|out)?)\s*(?:tk\.?|taka)?\s*([\d,]+(?:\.\d{1,2})?)/i;
const AMOUNT_FALLBACK_RE = /tk\.?\s*([\d,]+(?:\.\d{1,2})?)/i;

const SENDER_TITLE: Record<string, string> = {
  "16247": "bKash",
  "16167": "Nagad",
  "16216": "Rocket",
  "3222": "Upay",
};

function detectTitle(sender?: string, message?: string): string {
  const fromSender = (sender ?? "").replace(/\D/g, "");
  for (const [code, name] of Object.entries(SENDER_TITLE)) {
    if (fromSender.includes(code)) return name;
  }

  const senderLower = (sender ?? "").toLowerCase();
  const body = (message ?? "").toLowerCase();
  if (senderLower.includes("bkash") || body.includes("bkash")) return "bKash";
  if (
    senderLower.includes("nagad") ||
    body.includes("nagad") ||
    body.includes("money received")
  ) {
    return "Nagad";
  }
  if (body.includes("rocket")) return "Rocket";
  if (body.includes("upay")) return "Upay";

  return sender?.trim() || "SMS";
}

function parseAmount(message: string): number | null {
  const match =
    message.match(NAGAD_AMOUNT_RE) ??
    message.match(BKASH_AMOUNT_RE) ??
    message.match(AMOUNT_FALLBACK_RE);
  if (!match?.[1]) return null;
  const normalized = match[1].replace(/,/g, "");
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : null;
}

export function parsePaymentSms(
  sender?: string,
  message?: string
): ParsedPaymentSms | null {
  const body = (message ?? "").trim();
  if (!body) return null;

  const trxMatch = body.match(TXN_ID_RE);
  const trxid = trxMatch?.[1]?.trim().toUpperCase();
  const amount = parseAmount(body);

  if (!trxid || amount == null) return null;

  return {
    title: detectTitle(sender, body),
    trxid,
    amount,
  };
}
