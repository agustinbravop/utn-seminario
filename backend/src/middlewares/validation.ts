import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { BadRequestError } from "../utils/apierrors.js";

/**
 * Valida que el body cumpla con un zod schema.
 * Si es válido, **guarda el body parseado en `res.locals.body`**.
 * @param schema el zod Schema a validar contra el body.
 */
export function validateBody(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const issues = result.error.issues;
      const msg = issues
        .map((issue) => `At ${issue.path}: ${issue.message}`)
        .join("; ");
      throw new BadRequestError(msg);
    }

    res.locals.body = result.data;
    
    next();
  };
}

/**
 * Valida que el objeto query params recibido cumpla con un zod schema.
 * Si es válido, **guarda el query parseado en `res.locals.query`**.
 *
 * Nota: todos los query params son strings para HTTP.
 * Conviene usar `z.coerce...` para pasar esos strings a un `number`, `boolean`, etc.
 * Ref: https://zod.dev/?id=coercion-for-primitives
 *
 * @param schema - el zod Schema a validar contra los query params.
 */
export function validateQueryParams(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const issues = result.error.issues;
      const msg = issues
        .map((issue) => `Query param ${issue.path}: ${issue.message}`)
        .join("; ");
      throw new BadRequestError(msg);
    }

    res.locals.query = result.data;
    next();
  };
}

/**
 * Valida que los path params sean números enteros positivos.
 * Si uno no cumple, devuelve un 404 Bad Request.
 * @param params los path params a validar. Ej: `idEst` de '/establecimientos/:idEst'.
 */
export function validateIDParams(...params: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    for (const p of params) {
      let idParam = Number(req.params[p]);
      if (!idParam || idParam <= 0) {
        throw new BadRequestError(
          `Parámetro '${p}': ${req.params[p]} debe ser un número entero positivo`
        );
      }
    }
    next();
  };
}
