import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const expectedSecret = () =>
  (process.env.AUTOPAY_WEBHOOK_SECRET ?? "").trim();

/** Optional shared secret via `x-autopay-secret` header. */
export const verifyAutoPaySecret = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const secret = expectedSecret();
  if (!secret) return next();

  const provided = String(req.headers["x-autopay-secret"] ?? "").trim();
  if (provided !== secret) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Invalid AutoPay webhook secret",
    });
  }
  return next();
};
