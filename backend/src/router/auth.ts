import express, { Router } from "express";
import {
  AuthHandler,
  loginReqSchema,
  registroReqSchema,
} from "../handlers/auth.js";
import { validateBody } from "../middlewares/validation.js";

export function authRouter(handler: AuthHandler): Router {
  const router = express.Router();

  router.post("/login", validateBody(loginReqSchema), handler.login());
  router.post("/register", validateBody(registroReqSchema), handler.register());

  return router;
}
