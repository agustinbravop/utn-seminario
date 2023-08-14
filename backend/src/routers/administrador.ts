import { Router } from "express";
import { AdministradorHandler } from "../handlers/administrador.js";
import { AuthMiddleware } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validation.js";
import { administradorSchema } from "../models/administrador.js";

export function administradoresRouter(
  handler: AdministradorHandler,
  authMiddle: AuthMiddleware
): Router {
  const router = Router();

  router.get("/:id", handler.getAdministradorByID());

  router.put(
    "/:idAdmin/perfil",
    authMiddle.isAdmin(),
    validateBody(administradorSchema),
    handler.putAdmin()
  );

  return router;
}
