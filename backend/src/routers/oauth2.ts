import express, { Router } from "express";
import { AuthHandler } from "../handlers/auth.js";

export function oauth2Router(handler: AuthHandler): Router {
  const router = express.Router();

  router.get("/oauth2/redirect/google", handler.googleRedirect());

  return router;
}
