import { RequestHandler } from "express";
import { z } from "zod";
import { InformeService, PagosPorCanchaQuery } from "../services/informes.js";

export const informePagosPorCanchaQuerySchema = z.object({
  idEst: z.coerce.number().int(),
  fechaDesde: z.coerce.date().optional(),
  fechaHasta: z.coerce.date().optional(),
});

export class InformeHandler {
  private service: InformeService;
  constructor(service: InformeService) {
    this.service = service;
  }

  ingresosPorCancha(): RequestHandler {
    return async (_req, res) => {
      const query: PagosPorCanchaQuery = res.locals.query;
      const pagosPorCancha = await this.service.ingresosPorCancha(query);
      res.status(200).json(pagosPorCancha);
    };
  }
}
