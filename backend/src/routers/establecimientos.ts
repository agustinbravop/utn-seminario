import express from "express";
import { Router } from "express";
import multer from "multer";
import {
  EstablecimientoHandler,
  crearEstablecimientoReqSchema,
  modificarEstablecimientoReqSchema,
} from "../handlers/establecimientos.js";
import { validateBody, validateIDParams } from "../middlewares/validation.js";
import { AuthMiddleware } from "../middlewares/auth.js";

export function establecimientosRouter(
  handler: EstablecimientoHandler,
  authMiddle: AuthMiddleware,
  upload: multer.Multer
): Router {
  const router = express.Router();

  router.get(
    "/byAdmin/:idAdmin",
    validateIDParams("idAdmin"),
    handler.getEstablecimientosByAdminID()
  );

  router.post(
    "/",
    authMiddle.isAdmin(),
    validateBody(crearEstablecimientoReqSchema),
    handler.postEstablecimiento()
  );

  router.use("/:idEst", validateIDParams("idEst"));
  router.get("/:idEst", handler.getEstablecimientoByID());
  router.put(
    "/:idEst",
    authMiddle.isAdmin(),
    handler.validateAdminOwnsEstablecimiento(),
    validateBody(modificarEstablecimientoReqSchema),
    handler.putEstablecimiento()
  );
  router.patch(
    "/:idEst/imagen",
    authMiddle.isAdmin(),
    handler.validateAdminOwnsEstablecimiento(),
    upload.single("imagen"),
    handler.patchImagenEstablecimiento()
  );

  router.delete(
    "/:idEst",
    authMiddle.isAdmin(),
    handler.validateAdminOwnsEstablecimiento(),
    handler.eliminarEstablecimiento()
  );

  return router;
}
