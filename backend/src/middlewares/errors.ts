import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ApiError, InternalServerError } from "../utils/apierrors.js";

/**
 * Este middleware ataja los errores que sucedan en la aplicación,
 * y devuelve su `message` en el JSON body de la response.
 *
 * La response para los errores de tipo `ApiError` respeta su status code.
 * Un `Error` que no es `ApiError` provoca una response con status 500.
 */
export function handleApiErrors(): ErrorRequestHandler {
  return (err: Error, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
      console.error(err);
      res.status(err.status).json(err);
    } else {
      const e = new InternalServerError(`Error desconocido: ${err.message}`);
      console.error(e);
      res.status(e.status).json(e);
    }

    next(err);
  };
}
