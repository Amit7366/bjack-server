import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Try your current global shape first: { body, cookies, query }
      const wrapped = await schema.parseAsync({
        body: req.body,
        cookies: req.cookies,
        query: req.query,
        params: req.params,
      });

      // If schema returned parsed data, prefer the sanitized values:
      if (wrapped?.body) req.body = wrapped.body;
      if (wrapped?.query) req.query = wrapped.query;
      if (wrapped?.cookies) req.cookies = wrapped.cookies;
      if (wrapped?.params) req.params = wrapped.params as typeof req.params;

      return next();
    } catch (err) {
      // If it wasn't a Zod error, bubble it up
      if (!(err instanceof ZodError)) {
        return next(err);
      }

      // Fallback: some schemas are "flat" (no { body: ... } wrapper)
      try {
        const flat = await schema.parseAsync(req.body);
        // If flat validation succeeded, use the sanitized output
        if (flat && typeof flat === 'object') {
          req.body = flat as any;
        }
        return next();
      } catch (fallbackErr) {
        // Pass the original (wrapped) ZodError if you prefer, or fallbackErr if you want the flat error messages
        return next(fallbackErr instanceof ZodError ? fallbackErr : err);
      }
    }
  };
};

export default validateRequest;
