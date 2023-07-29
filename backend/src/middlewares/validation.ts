import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { BadRequestError } from "../utils/apierrors.js";

export function validateBody(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const issues = result.error.issues;
      const msg = issues
        .map((issue) => `At ${issue.path}: ${issue.message}`)
        .join("; ");
      return res.status(400).json(new BadRequestError(msg));
    }

    res.locals.body = result.data;
    next();
  };
}
