import { RequestHandler } from "express";
import {
  BuscarDisponibilidadesQuery,
  DisponibilidadService,
} from "../services/disponibilidades";
import {
  Disponibilidad,
  disponibilidadSchema,
} from "../models/disponibilidad.js";
import { ForbiddenError } from "../utils/apierrors";
import { z } from "zod";

export const crearDisponibilidadSchema = disponibilidadSchema.omit({
  id: true,
});

export const modificarDisponibilidadSchema = disponibilidadSchema;

export const buscarDisponibilidadesQuerySchema = z.object({
  idCancha: z.coerce.number().int().optional(),
  idEst: z.coerce.number().int().optional(),
});

export class DisponibilidadHandler {
  private service: DisponibilidadService;

  constructor(service: DisponibilidadService) {
    this.service = service;
  }

  getDisponibilidadesByCanchaID(): RequestHandler {
    return async (req, res) => {
      const idCancha = Number(req.params["idCancha"]);

      const disponibilidades = await this.service.getByCanchaID(idCancha);
      res.status(200).json(disponibilidades);
    };
  }

  getDisponibilidadByID(): RequestHandler {
    return async (req, res) => {
      const idDisp = Number(req.params["idDisp"]);

      const disponibilidad = await this.service.getByID(idDisp);

      res.status(200).json(disponibilidad);
    };
  }

  buscarDisponibilidades(): RequestHandler {
    return async (_req, res) => {
      const filtros: BuscarDisponibilidadesQuery = res.locals.query;
      const disps = await this.service.buscar(filtros);
      res.status(200).json(disps);
    };
  }

  putDisponibilidad(): RequestHandler {
    return async (req, res) => {
      const disp: Disponibilidad = {
        ...res.locals.body,
      };
      disp.id = Number(req.params["idDisp"]);

      const dispActualizada = await this.service.modificar(disp);
      res.status(200).json(dispActualizada);
    };
  }

  postDisponibilidad(): RequestHandler {
    return async (_req, res) => {
      const disp: Disponibilidad = res.locals.body;

      const dispCreada = await this.service.crear(disp);
      res.status(201).json(dispCreada);
    };
  }

  deleteDisponibilidad(): RequestHandler {
    return async (req, res) => {
      const idDisp = Number(req.params["idDisp"]);

      const dispEliminada = await this.service.eliminar(idDisp);
      res.status(200).json(dispEliminada);
    };
  }

  /**
   * Valida que el param `idDisp` corresponda a una disponibilidad del usuario con el JWT.
   * Este middleware **asume que el JWT del administrador ya fue autenticado.**
   *
   * Sirve para evitar que un administrador modifique una disponibilidad que no le pertenece.
   */
  validateAdminOwnsDisponibilidad(): RequestHandler {
    return async (req, res, next) => {
      const idDisp = Number(req.params.idDisp);
      const disps = await this.service.getByAdminID(res.locals.idAdmin);

      if (!disps.find((d) => d.id === idDisp)) {
        throw new ForbiddenError(
          "No puede alterar disponibilidades de otro administrador"
        );
      }

      next();
    };
  }
}
