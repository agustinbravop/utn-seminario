import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { router } from "./router.js";

const app: Application = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const prismaClient = new PrismaClient();
prismaClient
  .$connect()
  .then(() => console.log("Conexión exitosa con la base de datos"));

app.use("/", router(prismaClient));

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor desplegado en el puerto " + process.env.PORT || 3000);
});
