import { RequestHandler } from "express";
import { z } from "zod";
import {
  InformeService,
  ReservasPorCanchaQuery,
  HorariosPopularesQuery,
} from "../services/informes.js";

export const informeReservasPorCanchaQuerySchema = z.object({
  idEst: z.coerce.number().int().positive(),
  fechaDesde: z.coerce.date().optional(),
  fechaHasta: z.coerce.date().optional(),
});

export const horariosPopularesQuerySchema = z.object({
  idEst: z.coerce.number().int().positive(),
  horaInicio: z.string().optional(),
  horaFin: z.string().optional(),
  fechaDesde: z.coerce.date().optional(),
  fechaHasta: z.coerce.date().optional(),
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
      const query: ReservasPorCanchaQuery = res.locals.query;
      const pagosPorCancha = await this.service.pagosPorCancha(query);
      res.status(200).json(pagosPorCancha);
    };
  }

  diasDeSemanaPopulares(): RequestHandler {
    return async (_req, res) => {
      const query: HorariosPopularesQuery = res.locals.query;
      const reserva = await this.service.diasDeSemanaPopulares(query);
      res.status(200).json(reserva);
    };
  }

  horariosPopulares(): RequestHandler {
    return async (_req, res) => {
      const query: HorariosPopularesQuery = res.locals.query;
      const reserva = await this.service.horariosPopulares(query);
      res.status(200).json(reserva);
    };
  }
}
