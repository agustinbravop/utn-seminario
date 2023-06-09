import express from "express";
import { AuthHandler } from "../handlers/auth.js";
import { AuthServiceImpl } from "../services/auth.js";
import { PrismaAuthRepository } from "../repositories/auth.js";

export function authRouter() {
  const router = express.Router();

  const repository = new PrismaAuthRepository();
  const service = new AuthServiceImpl(repository);
  const handler = new AuthHandler(service);

  router.post("/login", handler.login());
  router.post("/register", handler.register());

  return router;
}
