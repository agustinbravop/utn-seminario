import { PrismaClient } from "@prisma/client";
import express, { Router } from "express";
import multer from "multer";
import { AuthHandler } from "./handlers/auth.js";
import { PrismaAuthRepository } from "./repositories/auth.js";
import { PrismaSuscripcionRepository } from "./repositories/suscripciones.js";
import { AuthServiceImpl } from "./services/auth.js";
import { SuscripcionServiceImpl } from "./services/suscripciones.js";
import { authRouter } from "./router/auth.js";
import { suscripcionesRouter } from "./router/suscripciones.js";
import { SuscripcionHandler } from "./handlers/suscripciones.js";
import { AdministradorHandler } from "./handlers/administrador.js";
import { PrismaAdministradorRepository } from "./repositories/administrador.js";
import { AdministradorServiceImpl } from "./services/administrador.js";
import { administradoresRouter } from "./router/administrador.js";
import { EstablecimientoHandler } from "./handlers/establecimientos.js";
import { PrismaEstablecimientoRepository } from "./repositories/establecimientos.js";
import { EstablecimientoServiceImpl } from "./services/establecimientos.js";
import { establecimientosRouter } from "./router/establecimientos.js";
import { AuthMiddleware } from "./middlewares/auth.js";
import { canchasRouter } from "./router/canchas.js";
import { PrismaCanchaRepository } from "./repositories/canchas.js";
import { CanchaServiceimpl } from "./services/canchas.js";
import { CanchaHandler } from "./handlers/canchas.js";

export function router(prismaClient: PrismaClient): Router {
  const router = express.Router();

  const suscripcionRepo = new PrismaSuscripcionRepository(prismaClient);
  const suscripcionService = new SuscripcionServiceImpl(suscripcionRepo);
  const suscripcionHandler = new SuscripcionHandler(suscripcionRepo);

  const authRepo = new PrismaAuthRepository(prismaClient);
  const authService = new AuthServiceImpl(authRepo);
  const authHandler = new AuthHandler(authService, suscripcionService);
  const authMiddle = new AuthMiddleware(authService);

  const adminRepo = new PrismaAdministradorRepository(prismaClient);
  const adminService = new AdministradorServiceImpl(adminRepo);
  const adminHandler = new AdministradorHandler(adminService);

  const estRepo = new PrismaEstablecimientoRepository(prismaClient);
  const estService = new EstablecimientoServiceImpl(estRepo, adminService);
  const estHandler = new EstablecimientoHandler(estService);

  const canchaRepo = new PrismaCanchaRepository(prismaClient);
  const canchaService = new CanchaServiceimpl(canchaRepo);
  const canchaHandler = new CanchaHandler(canchaService);

  const upload = multer({ dest: "imagenes/" });

  router.use("/suscripciones", suscripcionesRouter(suscripcionHandler));
  router.use("/auth", authRouter(authHandler));
  router.use("/administradores", administradoresRouter(adminHandler));

  router.use(
    "/establecimientos",
    establecimientosRouter(estHandler, authMiddle, upload)
  );
  router.use(
    "/establecimientos/:idEst",
    canchasRouter(canchaHandler, estHandler, authMiddle, upload)
  );

  return router;
}
