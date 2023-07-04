import express from "express";
import { Router } from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import { PrismaEstablecimientoRepository } from "../repositories/establecimientos.js";
import { EstablecimientoServiceImpl } from "../services/establecimientos.js";
import {establecimientoValidationUpdate} from "../middlewares/SchemaEstbalecimientoUpdate.js"
import {establecimientoSchemaUpdate} from "../validaciones/establecimientoUpdate.js"

import {
  EstablecimientoHandler,
  crearEstablecimientoReqSchema,
} from "../handlers/establecimientos.js";
import { PrismaAdministradorRepository } from "../repositories/administrador.js";
import { AdministradorServiceImpl } from "../services/administrador.js";
import { validateBody } from "../middlewares/validation.js";


export function establecimientosRouter(prismaClient: PrismaClient): Router {
  const router = express.Router();

  const adminRepo = new PrismaAdministradorRepository(prismaClient);
  const adminService = new AdministradorServiceImpl(adminRepo);

  const repository = new PrismaEstablecimientoRepository(prismaClient);
  const service = new EstablecimientoServiceImpl(repository, adminService);
  const handler = new EstablecimientoHandler(service);

  const upload = multer({ dest: "imagenes/" });

  router.post(
    "/",
    upload.single("imagen"),
    validateBody(crearEstablecimientoReqSchema),
    handler.crearEstablecimiento()
  );
  //router.get("/", handler.getByAdminID());
  //router.get("/:idAdmin", handler.getByAdminID());
  router.get("/:id/administrador/:idAdmin", handler.getEstablecimientoByIDByAdminID());
  router.put("/:id/administrador/:idAdmin", 
  upload.single("imagen"),
  establecimientoValidationUpdate(establecimientoSchemaUpdate),
  handler.putEstablecimientoByAdminIDByID());
  router.get("/administrador/:idAdmin", handler.getEstablecimientoByAdminID());
 


  return router;
}
