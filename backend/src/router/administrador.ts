import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { AdministradorHandler } from "../handlers/administrador.js";
import { PrismaAdministradorRepository } from "../repositories/administrador.js";
import { AdministradorServiceImpl } from "../services/administrador.js";

export function AdministradorRouter(prismaClient: PrismaClient): Router {
  const router = Router();

  const repository = new PrismaAdministradorRepository(prismaClient);
  const service = new AdministradorServiceImpl(repository);
  const handler = new AdministradorHandler(service);

  router.get("/:id", handler.getAdministradorByID());

  return router;
}
