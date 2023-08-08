import express, { Router } from "express";
import { SuscripcionHandler } from "../handlers/suscripciones.js";

export function suscripcionesRouter(handler: SuscripcionHandler): Router {
  const router = express.Router();

  router.get("/", handler.getAllSuscripciones());

  return router;
}
