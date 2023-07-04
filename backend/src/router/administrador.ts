import { Router } from "express";
import { AdministradorHandler } from "../handlers/administrador.js";

export function administradoresRouter(handler: AdministradorHandler): Router {
  const router = Router();

  router.get("/:id", handler.getAdministradorByID());

  return router;
}
