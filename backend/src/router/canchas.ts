import express from "express";
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaCanchaRepository } from "../repositories/canchas";
import { CanchaServiceimpl } from "../services/canchas";
import { CanchaHandler } from "../handlers/canchas";
import multer from "multer";
import { ActualizarCanchaSchema } from "../validaciones/ActualizarCancha";
import { validateBody } from "../middlewares/validation";

export function canchasRouter(prismaClient: PrismaClient): Router {
  const router = express.Router();

  const repository = new PrismaCanchaRepository(prismaClient);
  const service = new CanchaServiceimpl(repository);
  const handler = new CanchaHandler(service);
  const upload = multer({ dest: "imagenes/" });

  router.post(
    "/",
    upload.single("imagen"),
    validateBody(ActualizarCanchaSchema),
    handler.postCancha()
  );
  router.get("/", handler.getCanchasByEstablecimientoID());
  router.get("/:idCancha", handler.getCanchaByID());
  router.put(
    "/:idCancha",
    upload.single("imagen"),
    validateBody(ActualizarCanchaSchema),
    handler.putCancha()
  );

  return router;
}
