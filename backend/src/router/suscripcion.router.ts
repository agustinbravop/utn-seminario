import express from "express";
import { SuscripcionHandler } from "../handlers/suscripcion";
import { PrismaSuscripcionRepository } from "../repositories/suscripcion";
import { SuscripcionServiceImpl } from "../services/suscripciones";

export function suscripcionesRouter() {
  const router = express.Router();

  const repository = new PrismaSuscripcionRepository();
  const service = new SuscripcionServiceImpl(repository);
  const handler = new SuscripcionHandler(service);

  router.get("/", handler.getAllSuscripciones());

  return router;
}
