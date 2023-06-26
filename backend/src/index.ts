import express, { Application } from "express";
import { suscripcionesRouter } from "./router/suscripciones.js";
import tarjetaRouter from "./router/tarjeta.router.js";
import morgan from "morgan";
import cors from "cors";
import { authRouter } from "./router/auth.js";
import { PrismaClient } from "@prisma/client";
import { establecimientosRouter } from "./router/establecimientos.js";
import { AdministradorRouter } from "./router/administrador.js";
import { CanchaRouter } from "./router/cancha.js";

const app: Application = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());


const prismaClient = new PrismaClient();
prismaClient
  .$connect()
  .then(() => console.log("Conexión exitosa con la base de datos"));

app.use("/auth", authRouter(prismaClient));
app.use("/suscripciones", suscripcionesRouter(prismaClient));
app.use("/establecimientos", establecimientosRouter(prismaClient));
app.use("/administrador", AdministradorRouter(prismaClient));
app.use("/administradores", establecimientosRouter(prismaClient))
app.use("/tarjetas", tarjetaRouter);
app.use("/canchas", CanchaRouter(prismaClient))

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor desplegado en el puerto " + process.env.PORT || 3000);
});
