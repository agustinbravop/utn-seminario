import express, { Router } from "express";
import { validateQueryParams } from "../middlewares/validation.js";
import {
  InformeHandler,
  informePagosPorCanchaQuerySchema,
} from "../handlers/informes.js";

export function informesRouter(handler: InformeHandler): Router {
  const router = express.Router();

  router.get(
    "/ingresosPorCancha",
    validateQueryParams(informePagosPorCanchaQuerySchema),
    handler.ingresosPorCancha()
  );

  return router;
}
