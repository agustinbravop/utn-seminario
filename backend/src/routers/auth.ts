import express, { Router } from "express";
import {
  AuthHandler,
  cambiarClaveSchema,
  loginSchema,
  registrarAdminSchema,
  registrarJugadorSchema,
} from "../handlers/auth.js";
import { validateBody } from "../middlewares/validation.js";

export function authRouter(handler: AuthHandler): Router {
  const router = express.Router();

  router.get("/token", handler.refreshToken());
  router.post("/login", validateBody(loginSchema), handler.login());
  router.post(
    "/register/administrador",
    validateBody(registrarAdminSchema),
    handler.registerAdmin()
  );

  router.post(
    "/register/jugador",
    validateBody(registrarJugadorSchema),
    handler.registerJugador()
  );
  router.patch(
    "/clave",
    validateBody(cambiarClaveSchema),
    handler.patchClave()
  );

  return router;
}
