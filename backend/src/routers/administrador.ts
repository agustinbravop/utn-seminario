import { Router } from "express";
import {
  AdministradorHandler,
  modificarAdministradorSchema,
} from "../handlers/administrador.js";
import { validateBody, validateIDParams } from "../middlewares/validation.js";
import { AuthHandler } from "../handlers/auth.js";

export function administradoresRouter(
  handler: AdministradorHandler,
  authMiddle: AuthHandler
): Router {
  const router = Router();

  router.use("/:idAdmin", validateIDParams("idAdmin"));

  router.get("/:idAdmin", authMiddle.isAdmin(), handler.getAdministradorByID());
  router.patch(
    "/:idAdmin",
    authMiddle.isAdmin(),
    validateBody(modificarAdministradorSchema),
    handler.patchAdmin()
  );

  return router;
}
