import express from "express";
import { Router } from "express";
import { validateBody, validateIDParams } from "../middlewares/validation.js";
import { EstablecimientoHandler } from "../handlers/establecimientos.js";
import { AuthMiddleware } from "../middlewares/auth.js";
import {
  DisponibilidadHandler,
  crearDisponibilidadSchema,
  modificarDisponibilidadSchema,
} from "../handlers/disponibilidades.js";

export function disponibilidadesRouter(
  handler: DisponibilidadHandler,
  estHandler: EstablecimientoHandler,
  authMiddle: AuthMiddleware
): Router {
  const router = express.Router();

  router.get(
    "/:idEst/canchas/:idCancha/disponibilidades",
    handler.getDisponibilidadesByCanchaID()
  );
  router.post(
    "/:idEst/canchas/:idCancha/disponibilidades",
    validateBody(crearDisponibilidadSchema),
    handler.postDisponibilidad()
  );

  router.use(
    "/:idEst/canchas/:idCancha/disponibilidades/:idDisp",
    validateIDParams("idEst", "idCancha", "idDisp")
  );
  router.get(
    "/:idEst/canchas/:idCancha/disponibilidades/:idDisp",
    handler.getDisponibilidadByID()
  );

  router.put(
    "/:idEst/canchas/:idCancha/disponibilidades/:idDisp",
    authMiddle.isAdmin(),
    estHandler.validateAdminOwnsEstablecimiento(),
    validateBody(modificarDisponibilidadSchema),
    handler.putDisponibilidad()
  );
  router.delete(
    "/:idEst/canchas/:idCancha/disponibilidades/:idDisp",
    authMiddle.isAdmin(),
    estHandler.validateAdminOwnsEstablecimiento(),
    handler.deleteDisponibilidad()
  );

  return router;
}
