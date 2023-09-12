import express from "express";
import { Router } from "express";
import multer from "multer";
import {
  EstablecimientoHandler,
  crearEstablecimientoSchema,
  modificarEstablecimientoSchema,
} from "../handlers/establecimientos.js";
import { validateBody, validateIDParams } from "../middlewares/validation.js";
import { AuthHandler } from "../handlers/auth.js";

export function establecimientosRouter(
  handler: EstablecimientoHandler,
  authMiddle: AuthHandler,
  upload: multer.Multer
): Router {
  const router = express.Router();
  //PROVISIONAL
  router.get("/jugador", handler.getAllEstablecimientos());
  router.get("/byAdmin/:idAdmin", handler.getEstablecimientosByAdminID());
  router.get(
    "/byAdmin/deleted/:idAdmin",
    handler.getEstablecimientosEliminadosByAdminID()
  );
  router.get("/:idEst", handler.getEstablecimientoByID());
  router.get(
    "/byAdmin/:idAdmin",
    validateIDParams("idAdmin"),
    handler.getEstablecimientosByAdminID()
  );

  router.post(
    "/",
    authMiddle.isAdmin(),
    validateBody(crearEstablecimientoSchema),
    handler.postEstablecimiento()
  );

  //router.use("/:idEst", validateIDParams("idEst"));
  router.get("/:idEst", handler.getEstablecimientoByID(), validateIDParams("idEst"));
  router.get("/ests/search", handler.getEstablecimientoSearch())
  router.put(
    "/:idEst",
    authMiddle.isAdmin(),
    handler.validateAdminOwnsEstablecimiento(),
    validateBody(modificarEstablecimientoSchema),
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
