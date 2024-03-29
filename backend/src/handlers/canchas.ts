import { RequestHandler } from "express";
import { CanchaService } from "../services/canchas.js";
import { Cancha, canchaSchema } from "../models/cancha.js";
import { z } from "zod";
import { disponibilidadSchema } from "../models/disponibilidad.js";

export const crearCanchaSchema = canchaSchema
  .omit({
    id: true,
    urlImagen: true,
    eliminada: true,
  })
  .extend({
    disponibilidades: z.array(disponibilidadSchema.omit({ id: true })),
  });

export const modificarCanchaSchema = canchaSchema
  .omit({
    id: true,
    urlImagen: true,
    eliminada: true,
  })
  .extend({
    disponibilidades: z.array(disponibilidadSchema.partial({ id: true })),
  });

export const habilitarCanchaSchema = z.object({
  habilitada: z.boolean(),
});

export class CanchaHandler {
  private service: CanchaService;

  constructor(service: CanchaService) {
    this.service = service;
  }

  getCanchasByEstablecimientoID(): RequestHandler {
    return async (req, res) => {
      const idEst = Number(req.params["idEst"]);

      const cancha = await this.service.getByEstablecimientoID(idEst);
      res.status(200).json(cancha);
    };
  }

  getCanchaByID(): RequestHandler {
    return async (req, res) => {
      const idCancha = Number(req.params["idCancha"]);

      const cancha = await this.service.getByID(idCancha);

      res.status(200).json(cancha);
    };
  }

  putCancha(): RequestHandler {
    return async (req, res) => {
      const cancha: Cancha = {
        ...res.locals.body,
      };
      cancha.id = Number(req.params["idCancha"]);

      //Las dsponibilidades nuevas vienen sin id. Le asignamos un 0 para evitar errores.
      cancha.disponibilidades = cancha.disponibilidades
        .filter((d) => !d.id)
        .map((d) => ({ ...d, id: 0 }));

      const canchaActualizada = await this.service.modificar(cancha);
      res.status(200).json(canchaActualizada);
    };
  }

  patchImagenCancha(): RequestHandler {
    return async (req, res) => {
      const idCancha = Number(req.params["idCancha"]);
      const imagen = req.file;

      const canchaActualizada = await this.service.modificarImagen(
        idCancha,
        imagen
      );
      res.status(200).json(canchaActualizada);
    };
  }

  patchHabilitarCancha(): RequestHandler {
    return async (req, res) => {
      const idCancha = Number(req.params["idCancha"]);
      const { habilitada } = res.locals.body;

      const cancha = await this.service.habilitar(idCancha, habilitada);
      res.status(200).json(cancha);
    };
  }

  postCancha(): RequestHandler {
    return async (_req, res) => {
      const cancha: Cancha = res.locals.body;

      const canchaCreada = await this.service.crear(cancha);
      res.status(201).json(canchaCreada);
    };
  }

  deleteCancha(): RequestHandler {
    return async (req, res) => {
      const idCancha = Number(req.params["idCancha"]);
      const eliminarCancha = await this.service.eliminar(idCancha);
      res.status(200).json(eliminarCancha);
    };
  }
}
