import express from "express";
import { PrismaClient } from "@prisma/client";
import { createRouter } from "./router.js";
import "express-async-errors";

const prismaClient = new PrismaClient();
prismaClient
  .$connect()
  .then(() => console.info("🆗 Conexión exitosa con la base de datos"));

const app = express();

app.use("/", createRouter(prismaClient));

const puerto = process.env.PORT || 3000;
app.listen(puerto, () => {
  console.info("🆗 Servidor desplegado en el puerto " + puerto);
});
