import express from "express";
import { Router } from "express";
import multer from "multer";
import {
  EstablecimientoHandler,
  crearEstablecimientoReqSchema,
  modificarEstablecimientoReqSchema,
} from "../handlers/establecimientos.js";
import { validateBody } from "../middlewares/validation.js";
import { AuthMiddleware } from "../middlewares/auth.js";

export function establecimientosRouter(
  handler: EstablecimientoHandler,
  authMiddle: AuthMiddleware,
  upload: multer.Multer
): Router {
  const router = express.Router();

  router.get("/:idEst", handler.getEstablecimientoByID());
  router.get(
    "/:idEst/byAdmin/:idAdmin",
    handler.getEstablecimientosByAdminID()
  );
  router.post(
    "/",
    authMiddle.isAdmin(),
    validateBody(crearEstablecimientoReqSchema),
    upload.single("imagen"),
    handler.postEstablecimiento()
  );
  router.put(
    "/:idEst",
    authMiddle.isAdmin(),
    handler.validateAdminOwnsEstablecimiento(),
    validateBody(modificarEstablecimientoReqSchema),
    upload.single("imagen"),
    handler.putEstablecimiento()
  );

  return router;
}
