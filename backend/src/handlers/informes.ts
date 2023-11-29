import { RequestHandler } from "express";
import { z } from "zod";
import {
  InformeService,
  ReservasPorCanchaQuery,
  HorariosPopularesQuery,
  PagosPorCanchaQuery,
} from "../services/informes.js";

export const informeReservasPorCanchaQuerySchema = z.object({
  idEst: z.coerce.number().int(),
  fechaDesde: z.coerce.date().optional(),
  fechaHasta: z.coerce.date().optional(),
});

export const informePagosPorCanchaQuerySchema = z.object({
  idEst: z.coerce.number().int(),
  fechaDesde: z.coerce.date().optional(),
  fechaHasta: z.coerce.date().optional(),
});

export const informeHorarios = z.object({
  idEst: z.coerce.number().int(),
  horaInicio: z.string(),
  horaFinal: z.string(),
});

export class InformeHandler {
  private service: InformeService;
  constructor(service: InformeService) {
    this.service = service;
  }

  reservasPorCancha(): RequestHandler {
    return async (_req, res) => {
      const query: ReservasPorCanchaQuery = res.locals.query;
      const pagosPorCancha = await this.service.reservasPorCancha(query);
      res.status(200).json(pagosPorCancha);
    };
  }

  pagosPorCancha(): RequestHandler {
    return async (_req, res) => {
      const query: PagosPorCanchaQuery = res.locals.query;
      const pagosPorCancha = await this.service.pagosPorCancha(query);
      res.status(200).json(pagosPorCancha);
    };
  }

  HorariosMasConcurridos(): RequestHandler {
    return async (_req, res) => {
      const query: HorariosPopularesQuery = res.locals.query;
      const reserva = await this.service.horariosPopulares(query);
      res.status(200).json(reserva);
    };
  }
}
