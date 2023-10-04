import { RequestHandler } from "express";
import { Filtros, PagoService } from "../services/pagos.js";
import { z } from "zod";

export const buscarPagoQuerySchema = z.object({
  idCancha: z.number().int().optional(),
  idEst: z.number().int().optional(),
});

export class PagoHandler {
  private service: PagoService;
  constructor(service: PagoService) {
    this.service = service;
  }

  getPagoByID(): RequestHandler {
    return async (req, res) => {
      const id = Number(req.params.idPago);

      const est = await this.service.getByID(id);
      res.status(200).json(est);
    };
  }

  buscarPagos(): RequestHandler {
    return async (req, res) => {
      const filtros: Filtros = req.query;
      const pagos = await this.service.buscar(filtros);
      res.status(200).json(pagos);
    };
  }
}
