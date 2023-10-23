import express, { Router } from "express";
import { validateQueryParams } from "../middlewares/validation";
import {
  InformeHandler,
  informePagosPorCanchaQuerySchema,
} from "../handlers/informes";

export function informesRouter(handler: InformeHandler): Router {
  const router = express.Router();

  router.get(
    "/ingresosPorCancha",
    validateQueryParams(informePagosPorCanchaQuerySchema),
    handler.ingresosPorCancha()
  );

  return router;
}
