import express, { Router } from "express";
import { AuthHandler } from "../handlers/auth.js";
import { AuthServiceImpl } from "../services/auth.js";
import { PrismaAuthRepository } from "../repositories/auth.js";
import { PrismaSuscripcionRepository } from "../repositories/suscripciones.js";
import { SuscripcionServiceImpl } from "../services/suscripciones.js";
import { PrismaClient } from "@prisma/client";

export function authRouter(prismaClient: PrismaClient): Router {
  const router = express.Router();

  const susRepository = new PrismaSuscripcionRepository(prismaClient);
  const susService = new SuscripcionServiceImpl(susRepository);

  const repository = new PrismaAuthRepository(prismaClient);
  const service = new AuthServiceImpl(repository);
  const handler = new AuthHandler(service, susService);

  router.post("/login", handler.login());
  router.post("/register", handler.register());

  return router;
}
