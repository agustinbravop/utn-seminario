import express from "express";
import { Router } from "express";
import {
  CanchaHandler,
  crearCanchaReqSchema,
  modificarCanchaReqSchema,
} from "../handlers/canchas.js";
import multer from "multer";
import { validateBody } from "../middlewares/validation.js";
import { EstablecimientoHandler } from "../handlers/establecimientos.js";
import { AuthMiddleware } from "../middlewares/auth.js";

export function canchasRouter(
  handler: CanchaHandler,
  estHandler: EstablecimientoHandler,
  authMiddle: AuthMiddleware,
  upload: multer.Multer
): Router {
  const router = express.Router();

  router.get("/:idEst/canchas/", handler.getCanchasByEstablecimientoID());
  router.get("/:idEst/canchas/:idCancha", handler.getCanchaByID());
  router.post(
    "/:idEst/canchas/",
    authMiddle.isAdmin(),
    upload.single("imagen"),
    estHandler.validateAdminOwnsEstablecimiento(),
    validateBody(crearCanchaReqSchema),
    handler.postCancha()
  );
  router.put(
    "/:idEst/canchas/:idCancha",
    authMiddle.isAdmin(),
    upload.single("imagen"),
    estHandler.validateAdminOwnsEstablecimiento(),
    validateBody(modificarCanchaReqSchema),
    handler.putCancha()
  );

  return router;
}
