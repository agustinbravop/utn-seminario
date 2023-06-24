import express from "express";
import { Router } from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import { PrismaEstablecimientoRepository } from "../repositories/establecimientos.js";
import { EstablecimientoServiceImpl } from "../services/establecimientos.js";
import { EstablecimientoHandler } from "../handlers/establecimientos.js";
import { establecimientoValidation } from "../middlewares/SchemaEstablecimiento.middleware.js";
import {establecimientoValidationUpdate} from "../middlewares/SchemaEstbalecimientoUpdate.js"
import {establecimientoSchemaUpdate} from "../validaciones/establecimientoUpdate.js"
import { establecimientoSchema } from "../validaciones/establecimiento.validaciones.js";

export function establecimientosRouter(prismaClient: PrismaClient): Router {
  const router = express.Router();

  const repository = new PrismaEstablecimientoRepository(prismaClient);
  const service = new EstablecimientoServiceImpl(repository);
  const handler = new EstablecimientoHandler(service);

  const upload = multer({ dest: "imagenes/" });

  router.post(
    "/",
    upload.single("imagen"),
    establecimientoValidation(establecimientoSchema),
    handler.crearEstablecimiento()
  );
  router.get("/", handler.getByAdminID());
  router.get("/:idAdmin/establecimientos", handler.getEstablecimientoByAdminID());
  router.get("/:idAdmin/establecimientos/:id", handler.getEstablecimientoByIDByAdminID());
  router.put("/:idAdmin/establecimiento/:id", 
  upload.single("imagen"),
  establecimientoValidationUpdate(establecimientoSchemaUpdate),
  handler.putEstablecimientoByAdminIDByID());

  return router;
}
