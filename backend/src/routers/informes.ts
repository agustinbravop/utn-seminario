import express, { Router } from "express";
import { validateQueryParams } from "../middlewares/validation.js";
import {
  InformeHandler,
  diasDeSemanaPopularesQuerySchema,
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
    validateQueryParams(informeReservasPorCanchaQuerySchema),
    handler.pagosPorCancha()
  );

  router.get(
    "/diasDeSemana",
    validateQueryParams(diasDeSemanaPopularesQuerySchema),
    handler.diasDeSemanaPopulares()
  );
  router.get(
    "/horarios",
    validateQueryParams(diasDeSemanaPopularesQuerySchema),
    handler.horariosPopulares()
  );

  return router;
}
