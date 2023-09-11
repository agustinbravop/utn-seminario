import express, { Router } from "express";
import {
  ReservaHandler,
  crearReservaSchema,
  getReservaQuerySchema,
} from "../handlers/reservas.js";
import { AuthMiddleware } from "../middlewares/auth";
import {
  validateBody,
  validateIDParams,
  validateQueryParams,
} from "../middlewares/validation";

export function reservasRouter(
  handler: ReservaHandler,
  authMiddle: AuthMiddleware
): Router {
  const router = express.Router();

  router.get("/:idRes", validateIDParams("idRes"), handler.getReservaByID());
  router.get(
    "/",
    validateQueryParams(getReservaQuerySchema),
    handler.getReserva()
  );

  router.post(
    "/",
    authMiddle.isJugador(),
    validateBody(crearReservaSchema),
    handler.postReserva()
  );

  return router;
}
