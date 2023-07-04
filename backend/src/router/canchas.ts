import express from "express";
import { Router } from "express";
import { CanchaHandler } from "../handlers/canchas";
import multer from "multer";
import { ActualizarCanchaSchema } from "../validaciones/ActualizarCancha";
import { validateBody } from "../middlewares/validation";
import { EstablecimientoHandler } from "../handlers/establecimientos";
import { AuthMiddleware } from "../middlewares/auth";

export function canchasRouter(
  handler: CanchaHandler,
  estHandler: EstablecimientoHandler,
  authMiddle: AuthMiddleware,
  upload: multer.Multer
): Router {
  const router = express.Router();

  router.get("/", handler.getCanchasByEstablecimientoID());
  router.get("/:idCancha", handler.getCanchaByID());
  router.post(
    "/",
    authMiddle.isAdmin(),
    estHandler.validateAdminOwnsEstablecimiento(),
    upload.single("imagen"),
    validateBody(ActualizarCanchaSchema),
    handler.postCancha()
  );
  router.put(
    "/:idCancha",
    authMiddle.isAdmin(),
    estHandler.validateAdminOwnsEstablecimiento(),
    upload.single("imagen"),
    validateBody(ActualizarCanchaSchema),
    handler.putCancha()
  );

  return router;
}
