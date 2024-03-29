import express from "express";
import { Router } from "express";
import {
  validateBody,
  validateIDParams,
  validateQueryParams,
} from "../middlewares/validation.js";
import {
  DisponibilidadHandler,
  buscarDisponibilidadesQuerySchema,
  crearDisponibilidadSchema,
  modificarDisponibilidadSchema,
} from "../handlers/disponibilidades.js";
import { AuthHandler } from "../handlers/auth.js";

export function disponibilidadesRouter(
  handler: DisponibilidadHandler,
  authMiddle: AuthHandler
): Router {
  const router = express.Router();

  router.get(
    "/",
    validateQueryParams(buscarDisponibilidadesQuerySchema),
    handler.buscarDisponibilidades()
  );
  router.post(
    "/",
    validateBody(crearDisponibilidadSchema),
    handler.postDisponibilidad()
  );

  router.use("/:idDisp", validateIDParams("idDisp"));
  router.get("/:idDisp", handler.getDisponibilidadByID());

  router.put(
    "/:idDisp",
    authMiddle.isAdmin(),
    handler.validateAdminOwnsDisponibilidad(),
    validateBody(modificarDisponibilidadSchema),
    handler.putDisponibilidad()
  );
  router.delete(
    "/:idDisp",
    authMiddle.isAdmin(),
    handler.validateAdminOwnsDisponibilidad(),
    handler.deleteDisponibilidad()
  );

  return router;
}
