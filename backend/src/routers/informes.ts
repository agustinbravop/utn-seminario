import express, { Router } from "express";
import { validateQueryParams } from "../middlewares/validation.js";
import {
  InformeHandler,
  informeHorarios,
  informePagosPorCanchaQuerySchema,
  informeReservasPorCanchaQuerySchema,
} from "../handlers/informes.js";

export function informesRouter(handler: InformeHandler): Router {
  const router = express.Router();

  router.get(
    "/reservasPorCancha",
    validateQueryParams(informeReservasPorCanchaQuerySchema),
    handler.reservasPorCancha()
  );

  router.get(
    "/pagosPorCancha",
    validateQueryParams(informePagosPorCanchaQuerySchema),
    handler.pagosPorCancha()
  );

  router.get(
    "/estadistica",
    validateQueryParams(informeHorarios),
    handler.HorariosMasConcurridos()
  );

  return router;
}
