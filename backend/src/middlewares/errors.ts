import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ApiError } from "../utils/apierrors";

export function handleApiErrors(): ErrorRequestHandler {
  return (err: Error, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
      res.status(err.status).json(err);
    } else {
      res
        .status(500)
        .json(
          new ApiError(
            500,
            "Sucedió un error inesperado y desconocido: " + err.message
          )
        );
    }

    next();
  };
}
