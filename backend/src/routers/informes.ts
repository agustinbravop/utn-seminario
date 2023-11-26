import express, { Router } from "express";
import { validateQueryParams } from "../middlewares/validation";
import {
  InformeHandler,
  informeHorarios,
  informePagosPorCanchaQuerySchema,
} from "../handlers/informes";

export function informesRouter(handler: InformeHandler): Router {
  const router = express.Router();

  router.get(
    "/ingresosPorCancha",
    validateQueryParams(informePagosPorCanchaQuerySchema),
    handler.ingresosPorCancha()
  );

  router.get('/estadistica', validateQueryParams(informeHorarios), handler.HorariosMasConcurridos()); 

  return router;
}
