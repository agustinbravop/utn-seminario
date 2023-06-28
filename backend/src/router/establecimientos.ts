import express from "express";
import { Router } from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import { PrismaEstablecimientoRepository } from "../repositories/establecimientos.js";
import { EstablecimientoServiceImpl } from "../services/establecimientos.js";
<<<<<<< HEAD
import { EstablecimientoHandler } from "../handlers/establecimientos.js";
import { establecimientoValidation } from "../middlewares/SchemaEstablecimiento.middleware.js";
import {establecimientoValidationUpdate} from "../middlewares/SchemaEstbalecimientoUpdate.js"
import {establecimientoSchemaUpdate} from "../validaciones/establecimientoUpdate.js"
import { establecimientoSchema } from "../validaciones/establecimiento.validaciones.js";
=======
import {
  EstablecimientoHandler,
  crearEstablecimientoReqSchema,
} from "../handlers/establecimientos.js";
import { PrismaAdministradorRepository } from "../repositories/administrador.js";
import { AdministradorServiceImpl } from "../services/administrador.js";
import { validateBody } from "../middlewares/validation.js";
>>>>>>> 864bc67d86a3944c8a491f418f84937631672d97

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
<<<<<<< HEAD
  router.get("/", handler.getByAdminID());
  router.get("/:idAdmin/establecimientos", handler.getEstablecimientoByAdminID());
  router.get("/:idAdmin/establecimientos/:id", handler.getEstablecimientoByIDByAdminID());
  router.put("/:idAdmin/establecimiento/:id", 
  upload.single("imagen"),
  establecimientoValidationUpdate(establecimientoSchemaUpdate),
  handler.putEstablecimientoByAdminIDByID());
=======
  router.get("/:idAdmin", handler.getByAdminID());
>>>>>>> 864bc67d86a3944c8a491f418f84937631672d97

  return router;
}
