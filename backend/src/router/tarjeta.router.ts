import { Router } from "express";
import {
  getAllTarjeta,
  getTarjetaById,
  getTarjetaByName,
  postTarjeta,
} from "../handlers/tarjeta.controller.js";

const router = Router();

router.get("/tarjetas", getAllTarjeta);
router.get("/tarjeta_id/:id", getTarjetaById);
router.get("/tarjeta_nombre/:nombre", getTarjetaByName);
router.post("/tarjeta", postTarjeta);

export default router;
