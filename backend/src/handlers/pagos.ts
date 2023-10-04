import { RequestHandler } from "express";
import { BuscarPagoQuery, PagoService } from "../services/pagos.js";
import { z } from "zod";

export const buscarPagoQuerySchema = z.object({
  idCancha: z.coerce.number().int().optional(),
  idEst: z.coerce.number().int().optional(),
  fechaDesde: z.coerce
    .string()
    .optional()
    .transform((data) => data && new Date(data).toISOString()),
  fechaHasta: z.coerce
    .string()
    .optional()
    .transform((data) => data && new Date(data).toISOString()),
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
    return async (_req, res) => {
      const filtros: BuscarPagoQuery = res.locals.query;
      const pagos = await this.service.buscar(filtros);
      res.status(200).json(pagos);
    };
  }
}
