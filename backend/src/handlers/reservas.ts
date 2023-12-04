import { RequestHandler } from "express";
import { z } from "zod";
import { CrearReserva, ReservaService } from "../services/reservas.js";
import { BadRequestError } from "../utils/apierrors.js";

export const crearReservaSchema = z.object({
  idDisponibilidad: z.number().positive().int(),
  fechaReservada: z.coerce.date(),
  jugadorNoRegistrado: z.string().optional(),
});

export const getReservaQuerySchema = z.object({
  idJugador: z.coerce.number().positive().int().optional(),
  idDisp: z.coerce.number().positive().int().optional(),
  idEst: z.coerce.number().positive().int().optional(),
});

type GetReservaQuery = z.infer<typeof getReservaQuerySchema>;

export class ReservaHandler {
  private service: ReservaService;

  constructor(service: ReservaService) {
    this.service = service;
  }

  getReserva(): RequestHandler {
    return async (_req, res) => {
      const query: GetReservaQuery = res.locals.query;
      let reserva;
      if (query.idDisp) {
        reserva = await this.service.getByDisponibilidadID(query.idDisp);
      } else if (query.idEst) {
        reserva = await this.service.getByEstablecimientoID(query.idEst);
      } else if (query.idJugador) {
        reserva = await this.service.getByJugadorID(query.idJugador);
      } else {
        throw new BadRequestError(
          "Especificar un query param: 'idJugador', 'idDisp' o 'idEst'."
        );
      }

      res.status(200).json(reserva);
    };
  }

  getReservaByID(): RequestHandler {
    return async (req, res) => {
      const idReserva = Number(req.params["idRes"]);
      const reserva = await this.service.getByID(idReserva);
      res.status(200).json(reserva);
    };
  }

  postReserva(): RequestHandler {
    return async (_req, res) => {
      const crearReserva: CrearReserva = res.locals.body;
      const idJugador = res.locals.idJugador ? res.locals.idJugador : 0;
      const reservaCreada = await this.service.crear({
        ...crearReserva,
        idJugador,
      });
      res.status(201).json(reservaCreada);
    };
  }

  seniarReserva(): RequestHandler {
    return async (req, res) => {
      const id = Number(req.params["idRes"]);
      const reservaSeniada = await this.service.pagarSenia(id);
      res.status(201).json(reservaSeniada);
    };
  }

  pagarReserva(): RequestHandler {
    return async (req, res) => {
      const id = Number(req.params["idRes"]);
      const reservaPagada = await this.service.pagarReserva(id);
      res.status(201).json(reservaPagada);
    };
  }

  cancelarReserva(): RequestHandler {
    return async (req, res) => {
      const idReserva = Number(req.params["idRes"]);
      const reservaCancelada = await this.service.cancelarReserva(idReserva);
      res.status(201).json(reservaCancelada);
    };
  }
}
