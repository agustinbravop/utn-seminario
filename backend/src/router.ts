import { PrismaClient } from "@prisma/client";
import express, { Router } from "express";
import { AuthHandler } from "./handlers/auth";
import { PrismaAuthRepository } from "./repositories/auth";
import { PrismaSuscripcionRepository } from "./repositories/suscripciones";
import { AuthServiceImpl } from "./services/auth";
import { SuscripcionServiceImpl } from "./services/suscripciones";
import { authRouter } from "./router/auth";
import { suscripcionesRouter } from "./router/suscripciones";
import { SuscripcionHandler } from "./handlers/suscripciones";
import { AdministradorHandler } from "./handlers/administrador";
import { PrismaAdministradorRepository } from "./repositories/administrador";
import { AdministradorServiceImpl } from "./services/administrador";
import { administradoresRouter } from "./router/administrador";
import multer from "multer";
import { EstablecimientoHandler } from "./handlers/establecimientos";
import { PrismaEstablecimientoRepository } from "./repositories/establecimientos";
import { EstablecimientoServiceImpl } from "./services/establecimientos";
import { establecimientosRouter } from "./router/establecimientos";
import { AuthMiddleware } from "./middlewares/auth";
import { canchasRouter } from "./router/canchas";
import { PrismaCanchaRepository } from "./repositories/canchas";
import { CanchaServiceimpl } from "./services/canchas";
import { CanchaHandler } from "./handlers/canchas";

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
