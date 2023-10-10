import express, { Application } from "express";
import { PrismaClient } from "@prisma/client";
import { createRouter } from "./router.js";
import "express-async-errors";

const prismaClient = new PrismaClient();
prismaClient
  .$connect()
  .then(() => console.info("Conexión exitosa con la base de datos"));

const app: Application = express();

app.use("/", createRouter(prismaClient));

app.listen(process.env.PORT || 3000, () => {
  console.info("Servidor desplegado en el puerto " + process.env.PORT || 3000);
});
