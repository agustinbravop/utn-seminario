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
      console.error("Body recibido: ", req.body);

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
 * Valida que los nombres de los params pasados por parámetro sean números enteros positivos.
 * Ej: 'idAdmin', 'idCancha'. En caso contrario, devuelve un 404 Bad Request.
 */
export function validateIDParams(...params: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    for (const p of params) {
      let idParam = Number(req.params[p]);
      if (!idParam || idParam <= 0) {
        throw new BadRequestError(
          `El parámetro '${p}': ${req.params[p]} debe ser un número entero positivo`
        );
      }
    }

    next();
  };
}
