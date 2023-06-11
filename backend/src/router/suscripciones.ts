import express, { Router } from "express";
import { SuscripcionHandler } from "../handlers/suscripciones.js";
import { PrismaSuscripcionRepository } from "../repositories/suscripciones.js";
import { SuscripcionServiceImpl } from "../services/suscripciones.js";
import { PrismaClient } from "@prisma/client";

export function suscripcionesRouter(prismaClient: PrismaClient): Router {
  const router = express.Router();

  const repository = new PrismaSuscripcionRepository(prismaClient);
  const service = new SuscripcionServiceImpl(repository);
  const handler = new SuscripcionHandler(service);

  router.get("/", handler.getAllSuscripciones());

  return router;
}
