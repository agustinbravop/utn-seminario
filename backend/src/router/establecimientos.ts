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

  router.get("/byAdmin/:idAdmin", handler.getEstablecimientosByAdminID());
  router.get("/:idEst", handler.getEstablecimientoByID());
  router.post(
    "/",
    authMiddle.isAdmin(),
    upload.single("imagen"),
    validateBody(crearEstablecimientoReqSchema),
    handler.postEstablecimiento()
  );
  router.put(
    "/:idEst",
    authMiddle.isAdmin(),
    upload.single("imagen"),
    handler.validateAdminOwnsEstablecimiento(),
    validateBody(modificarEstablecimientoReqSchema),
    handler.putEstablecimiento()
  );

  router.delete(
    "/:idEst",
    authMiddle.isAdmin(),
    handler.validateAdminOwnsEstablecimiento(),
    handler.eliminarEstablecimiento()
  );

  return router;
}
