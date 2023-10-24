import express from "express";
import { Router } from "express";
import {
  CanchaHandler,
  crearCanchaSchema,
  habilitarCanchaSchema,
  modificarCanchaSchema,
} from "../handlers/canchas.js";
import multer from "multer";
import { validateBody, validateIDParams } from "../middlewares/validation.js";
import { EstablecimientoHandler } from "../handlers/establecimientos.js";
import { AuthHandler } from "../handlers/auth.js";
import { DisponibilidadHandler } from "../handlers/disponibilidades.js";

export function canchasRouter(
  handler: CanchaHandler,
  estHandler: EstablecimientoHandler,
  dispHandler: DisponibilidadHandler,
  authMiddle: AuthHandler,
  upload: multer.Multer
): Router {
  const router = express.Router();

  router.get("/:idEst/canchas/", handler.getCanchasByEstablecimientoID());
  router.post(
    "/:idEst/canchas/",
    authMiddle.isAdmin(),
    estHandler.validateAdminOwnsEstablecimiento(),
    validateBody(crearCanchaSchema),
    handler.postCancha()
  );

  router.use(
    "/:idEst/canchas/:idCancha",
    validateIDParams("idEst", "idCancha")
  );
  router.get("/:idEst/canchas/:idCancha", handler.getCanchaByID());
  router.get(
    "/:idEst/canchas/:idCancha/disponibilidades",
    dispHandler.getDisponibilidadesByCanchaID()
  );

  router.put(
    "/:idEst/canchas/:idCancha",
    authMiddle.isAdmin(),
    estHandler.validateAdminOwnsEstablecimiento(),
    validateBody(modificarCanchaSchema),
    handler.putCancha()
  );
  router.patch(
    "/:idEst/canchas/:idCancha/imagen",
    authMiddle.isAdmin(),
    estHandler.validateAdminOwnsEstablecimiento(),
    upload.single("imagen"),
    handler.patchImagenCancha()
  );
  router.patch(
    "/:idEst/canchas/:idCancha/habilitada",
    authMiddle.isAdmin(),
    estHandler.validateAdminOwnsEstablecimiento(),
    validateBody(habilitarCanchaSchema),
    handler.patchHabilitarCancha()
  );
  router.delete(
    "/:idEst/canchas/:idCancha",
    authMiddle.isAdmin(),
    estHandler.validateAdminOwnsEstablecimiento(),
    handler.deleteCancha()
  );

  return router;
}
