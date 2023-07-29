import { RequestHandler } from "express";
import { SuscripcionService } from "../services/suscripciones.js";

export class SuscripcionHandler {
  private service: SuscripcionService;

  constructor(service: SuscripcionService) {
    this.service = service;
  }

  getAllSuscripciones(): RequestHandler {
    return async (_req, res) => {
      const suscripciones = await this.service.getAllSuscripciones();
      res.status(200).json(suscripciones);
    };
  }
}
