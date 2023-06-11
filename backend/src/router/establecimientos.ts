import express from "express";
import { Router } from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import { PrismaEstablecimientoRepository } from "../repositories/establecimientos.js";
import { EstablecimientoServiceImpl } from "../services/establecimientos.js";
import { EstablecimientoHandler } from "../handlers/establecimientos.js";

export function establecimientosRouter(prismaClient: PrismaClient): Router {
  const router = express.Router();

  const repository = new PrismaEstablecimientoRepository(prismaClient);
  const service = new EstablecimientoServiceImpl(repository);
  const handler = new EstablecimientoHandler(service);

  const upload = multer({ dest: "imagenes/" });

  router.post(
    "/",
    upload.single("imagen"),
    handler.crearEstablecimiento()
  );

  return router;
}
