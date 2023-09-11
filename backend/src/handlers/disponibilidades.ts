import { RequestHandler } from "express";
import { DisponibilidadService } from "../services/disponibilidades.js";
import {
  Disponibilidad,
  disponibilidadSchema,
} from "../models/disponibilidad.js";

export const crearDisponibilidadReqSchema = disponibilidadSchema.omit({
  id: true,
});

export const modificarDisponibilidadReqSchema = disponibilidadSchema;

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
}
