import { RequestHandler } from "express";
import { SuscripcionService } from "../services/suscripciones.js";

export class SuscripcionHandler {
  private service: SuscripcionService;

  constructor(service: SuscripcionService) {
    this.service = service;
  }

  getAllSuscripciones(): RequestHandler {
    return async (_req, res) => {
      console.log("-> handler");
      const susResult = await this.service.getAllSuscripciones();
      susResult.match(
        (suscripciones) => res.status(200).json(suscripciones),
        (err) => res.status(err.status).json(err)
      );
    };
  }
}
