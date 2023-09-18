import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ApiError, InternalServerError } from "../utils/apierrors.js";

function logError(error: ApiError, req: Request, res: Response) {
  console.error("⛔ ApiError:", error);
  console.error("⛔ Body validado:", res.locals.body);
  console.error("⛔ URI:", req.url);
}
/**
 * Este middleware ataja los errores que sucedan en la aplicación,
 * y devuelve su `message` en el JSON body de la response.
 *
 * La response para los errores de tipo `ApiError` respeta su status code.
 * Un `Error` que no es `ApiError` provoca una response con status 500.
 */
export function handleApiErrors(): ErrorRequestHandler {
  return (err: Error, req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ApiError) {
      logError(err, req, res);
      res.status(err.status).json(err);
    } else {
      const e = new InternalServerError(`Error desconocido: ${err.message}`);
      logError(e, req, res);
      res.status(e.status).json(e);
    }
  };
}
