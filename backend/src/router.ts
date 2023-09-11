import { PrismaClient } from "@prisma/client";
import express, { Router } from "express";
import cors from "cors";
import multer from "multer";
import { AuthHandler } from "./handlers/auth.js";
import { PrismaAuthRepository } from "./repositories/auth.js";
import { PrismaSuscripcionRepository } from "./repositories/suscripciones.js";
import { AuthServiceImpl } from "./services/auth.js";
import { SuscripcionServiceImpl } from "./services/suscripciones.js";
import { authRouter } from "./routers/auth.js";
import { suscripcionesRouter } from "./routers/suscripciones.js";
import { SuscripcionHandler } from "./handlers/suscripciones.js";
import { AdministradorHandler } from "./handlers/administrador.js";
import { PrismaAdministradorRepository } from "./repositories/administrador.js";
import { AdministradorServiceImpl } from "./services/administrador.js";
import { administradoresRouter } from "./routers/administrador.js";
import { EstablecimientoHandler } from "./handlers/establecimientos.js";
import { PrismaEstablecimientoRepository } from "./repositories/establecimientos.js";
import { EstablecimientoServiceImpl } from "./services/establecimientos.js";
import { establecimientosRouter } from "./routers/establecimientos.js";
import { AuthMiddleware } from "./middlewares/auth.js";
import { canchasRouter } from "./routers/canchas.js";
import { PrismaCanchaRepository } from "./repositories/canchas.js";
import { CanchaServiceimpl } from "./services/canchas.js";
import { CanchaHandler } from "./handlers/canchas.js";
import morgan from "morgan";
import { handleApiErrors } from "./middlewares/errors.js";
import { disponibilidadesRouter } from "./routers/disponibilidades.js";
import { DisponibilidadHandler } from "./handlers/disponibilidades.js";
import { PrismaDisponibilidadRepository } from "./repositories/disponibilidades.js";
import { DisponibilidadServiceimpl } from "./services/disponibilidades.js";
import { PrismaReservaRepository } from "./repositories/reservas.js";
import { ReservaServiceImpl } from "./services/reservas.js";
import { ReservaHandler } from "./handlers/reservas.js";
import { reservasRouter } from "./routers/reservas.js";

export function createRouter(prismaClient: PrismaClient): Router {
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

  const dispRepo = new PrismaDisponibilidadRepository(prismaClient);
  const dispService = new DisponibilidadServiceimpl(dispRepo);
  const dispHandler = new DisponibilidadHandler(dispService);

  const canchaRepo = new PrismaCanchaRepository(prismaClient, dispRepo);
  const canchaService = new CanchaServiceimpl(canchaRepo);
  const canchaHandler = new CanchaHandler(canchaService);

  const estRepo = new PrismaEstablecimientoRepository(prismaClient);
  const estService = new EstablecimientoServiceImpl(estRepo, adminService);
  const estHandler = new EstablecimientoHandler(estService);

  const resRepo = new PrismaReservaRepository(prismaClient);
  const resService = new ReservaServiceImpl(resRepo, canchaRepo, dispRepo);
  const resHandler = new ReservaHandler(resService);

  const upload = multer({ dest: "imagenes/" });

  // Middlewares globales a todos los endpoints.
  router.use(cors());
  router.use(morgan("dev"));
  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  // Subrouters, normalmente uno por cada entidad.
  router.use("/auth", authRouter(authHandler));
  router.use("/suscripciones", suscripcionesRouter(suscripcionHandler));
  router.use(
    "/administradores",
    administradoresRouter(adminHandler, authMiddle)
  );
  router.use(
    "/establecimientos",
    establecimientosRouter(estHandler, authMiddle, upload),
    canchasRouter(canchaHandler, estHandler, authMiddle, upload),
    disponibilidadesRouter(dispHandler, estHandler, authMiddle)
  );
  router.use("/reservas", reservasRouter(resHandler, authMiddle));

  // Error handler global. Ataja los errores tirados por los otros handlers.
  router.use(handleApiErrors());

  return router;
}
