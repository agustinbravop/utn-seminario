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
import { canchasRouter } from "./routers/canchas.js";
import { PrismaCanchaRepository } from "./repositories/canchas.js";
import { CanchaServiceImpl } from "./services/canchas.js";
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
import { JugadorHandler } from "./handlers/jugador.js";
import { PrismaJugadorRepository } from "./repositories/jugador.js";
import { JugadorServiceImpl } from "./services/jugador.js";
import { jugadoresRouter } from "./routers/jugador.js";
import { PrismaPagoRepository } from "./repositories/pagos.js";
import { pagosRouter } from "./routers/pagos.js";
import { PagoServiceImpl } from "./services/pagos.js";
import { PagoHandler } from "./handlers/pagos.js";
import { informesRouter } from "./routers/informes.js";
import { InformeServiceImpl } from "./services/informes.js";
import { InformeHandler } from "./handlers/informes.js";
import { oauth2Router } from "./routers/oauth2.js";
import { PrismaInformeRepository } from "./repositories/informes.js";

export function createRouter(prismaClient: PrismaClient): Router {
  const router = express.Router();

  const suscripcionRepo = new PrismaSuscripcionRepository(prismaClient);
  const suscripcionService = new SuscripcionServiceImpl(suscripcionRepo);
  const suscripcionHandler = new SuscripcionHandler(suscripcionService);

  const authRepo = new PrismaAuthRepository(prismaClient);
  const authService = new AuthServiceImpl(authRepo);
  const authHandler = new AuthHandler(authService, suscripcionService);

  const adminRepo = new PrismaAdministradorRepository(prismaClient);
  const adminService = new AdministradorServiceImpl(adminRepo);
  const adminHandler = new AdministradorHandler(adminService);

  const jugadorRepo = new PrismaJugadorRepository(prismaClient);
  const jugadorService = new JugadorServiceImpl(jugadorRepo);
  const jugadorHandler = new JugadorHandler(jugadorService);

  const resRepo = new PrismaReservaRepository(prismaClient);
  const dispRepo = new PrismaDisponibilidadRepository(prismaClient, resRepo);
  const dispService = new DisponibilidadServiceimpl(dispRepo);
  const dispHandler = new DisponibilidadHandler(dispService);

  const canchaRepo = new PrismaCanchaRepository(prismaClient, dispRepo);
  const canchaService = new CanchaServiceImpl(canchaRepo);
  const canchaHandler = new CanchaHandler(canchaService);

  const estRepo = new PrismaEstablecimientoRepository(prismaClient);
  const estService = new EstablecimientoServiceImpl(
    estRepo,
    adminService,
    canchaService
  );
  const estHandler = new EstablecimientoHandler(estService);

  const pagoRepo = new PrismaPagoRepository(prismaClient);
  const pagoService = new PagoServiceImpl(pagoRepo);
  const pagoHandler = new PagoHandler(pagoService);

  const resService = new ReservaServiceImpl(
    resRepo,
    canchaRepo,
    dispRepo,
    pagoRepo
  );
  const resHandler = new ReservaHandler(resService);
  const informeRepo = new PrismaInformeRepository(prismaClient);

  const informeService = new InformeServiceImpl(
    estService,
    canchaService,
    resService,
    pagoService,
    informeRepo
  );
  const informeHandler = new InformeHandler(informeService);

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
    administradoresRouter(adminHandler, authHandler)
  );
  router.use("/jugadores", jugadoresRouter(jugadorHandler, authHandler));
  router.use(
    "/establecimientos",
    establecimientosRouter(estHandler, authHandler, upload),
    canchasRouter(canchaHandler, estHandler, dispHandler, authHandler, upload)
  );
  router.use(
    "/disponibilidades",
    disponibilidadesRouter(dispHandler, authHandler)
  );
  router.use("/reservas", reservasRouter(resHandler, authHandler));
  router.use("/pagos", pagosRouter(pagoHandler));
  router.use("/informes", informesRouter(informeHandler));

  // Endpoints ajenos a una entidad, o callbacks de servicios externos
  router.use("/", oauth2Router(authHandler));

  // Error handler global. Ataja los errores tirados por los otros handlers.
  router.use(handleApiErrors());

  return router;
}
