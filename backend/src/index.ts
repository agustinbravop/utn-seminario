import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { createRouter } from "./router.js";
import { handleApiErrors } from "./middlewares/errors.js";
import "express-async-errors";

const prismaClient = new PrismaClient();
prismaClient
  .$connect()
  .then(() => console.log("Conexión exitosa con la base de datos"));

const app: Application = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", createRouter(prismaClient));
app.use(handleApiErrors());

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor desplegado en el puerto " + process.env.PORT || 3000);
});
