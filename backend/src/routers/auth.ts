import express, { Router } from "express";
import {
  AuthHandler,
  loginReqSchema,
  registrarAdminSchema,
  registrarJugadorSchema,
} from "../handlers/auth.js";
import { validateBody } from "../middlewares/validation.js";
import { AuthMiddleware } from "../middlewares/auth.js";

export function authRouter(
  handler: AuthHandler,
  authMiddle: AuthMiddleware
): Router {
  const router = express.Router();

  router.post("/login", validateBody(loginReqSchema), handler.login());
  router.post(
    "/register/administrador",
    validateBody(registrarAdminSchema),
    handler.registerAdmin()
  );

  router.put("/cambiarContrasenia", handler.cambiarContrasenia())

  router.post(
    "/register/jugador",
    validateBody(registrarJugadorSchema),
    handler.registerJugador()
  );
  router.get("/token", authMiddle.isAdmin(), handler.refreshToken());

  return router;
}
