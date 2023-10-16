import express, { Router } from "express";
import {
  validateIDParams,
  validateQueryParams,
} from "../middlewares/validation";
import { PagoHandler, buscarPagosQuerySchema } from "../handlers/pagos.js";


export function pagosRouter(handler: PagoHandler): Router {
  const router = express.Router();

  router.get("/:idPago", validateIDParams("idPago"), handler.getPagoByID());
  router.get(
    "/",
    validateQueryParams(buscarPagosQuerySchema),
    handler.buscarPagos()
  );

  router.post("/process_payment", handler.crearPago())

    

  return router;
}
