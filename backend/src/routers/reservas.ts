import express, { Router } from "express";
import {
  ReservaHandler,
  crearReservaSchema,
  getReservaQuerySchema,
} from "../handlers/reservas.js";
import {
  validateBody,
  validateIDParams,
  validateQueryParams,
} from "../middlewares/validation";
import { AuthHandler } from "../handlers/auth.js";

export function reservasRouter(
  handler: ReservaHandler,
  authMiddle: AuthHandler
): Router {
  const router = express.Router();

  router.get("/:idRes", validateIDParams("idRes"), handler.getReservaByID());
  router.get(
    "/",
    validateQueryParams(getReservaQuerySchema),
    handler.getReserva()
  );

  router.get("/Activas/:idEst", handler.getReservaActiva())

  router.post(
    "/",
    authMiddle.isJugador(),
    validateBody(crearReservaSchema),
    handler.postReserva()
  );

  return router;
}
