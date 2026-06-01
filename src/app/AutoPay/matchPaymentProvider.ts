export type AutoPayPaymentMethod = "bkash" | "nagad" | "rocket";

/** URL query value → API paymentMethod enum. */
export function normalizePaymentMethod(input: string): AutoPayPaymentMethod {
  const key = input.trim().toLowerCase();
  if (key === "nagad") return "nagad";
  if (key === "rocket") return "rocket";
  return "bkash";
}

/** Canonical method string for deposit URLs (matches SMS sender spelling). */
export function paymentMethodToUrlParam(method: AutoPayPaymentMethod): string {
  if (method === "nagad") return "NAGAD";
  if (method === "rocket") return "Rocket";
  return "bKash";
}

/** Match autopay_sms sender/title against the wallet the user selected. */
export function smsMatchesPaymentMethod(
  sms: { title?: string; sender?: string },
  paymentMethod: AutoPayPaymentMethod
): boolean {
  const title = (sms.title ?? "").trim();
  const sender = (sms.sender ?? "").trim();
  const titleLower = title.toLowerCase();
  const senderLower = sender.toLowerCase();

  if (paymentMethod === "bkash") {
    return (
      senderLower === "bkash" ||
      titleLower === "bkash" ||
      titleLower.includes("bkash") ||
      senderLower.includes("bkash") ||
      sender.replace(/\D/g, "").includes("16247")
    );
  }

  if (paymentMethod === "nagad") {
    return (
      senderLower === "nagad" ||
      titleLower === "nagad" ||
      titleLower.includes("nagad") ||
      senderLower.includes("nagad") ||
      sender.replace(/\D/g, "").includes("16167")
    );
  }

  return (
    titleLower.includes("rocket") ||
    senderLower.includes("rocket") ||
    sender.replace(/\D/g, "").includes("16216")
  );
}
