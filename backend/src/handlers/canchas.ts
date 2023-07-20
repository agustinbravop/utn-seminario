import { RequestHandler } from "express";
import { CanchaService } from "../services/canchas.js";
import { Cancha, canchaSchema } from "../models/cancha.js";
import { z } from "zod";

export const crearCanchaReqSchema = canchaSchema
  .omit({
    id: true,
    urlImagen: true,
  })
  .extend({
    idEstablecimiento: z.string().transform((str) => Number(str)),
    estaHabilitada: z.string().transform((str) => str === "true"),
    // TODO: agregar validaciones para disciplinas (string[]) en un multipart/form-data
    disciplinas: z.string().transform((_) => ["Fútbol"]),
  });

export const modificarCanchaReqSchema = canchaSchema
  .omit({
    urlImagen: true,
  })
  .extend({
    idEstablecimiento: z.string().transform((str) => Number(str)),
    estaHabilitada: z.string().transform((str) => str === "true"),
    disciplinas: z.string().transform((_) => [""]),
  });

export class CanchaHandler {
  private service: CanchaService;

  constructor(service: CanchaService) {
    this.service = service;
  }

  getCanchasByEstablecimientoID(): RequestHandler {
    return async (req, res) => {
      console.log(req.params);
      const idEst = Number(req.params["idEst"]);

      const cancha = await this.service.getCanchasByEstablecimientoID(idEst);
      res.status(200).json(cancha);
    };
  }

  getCanchaByID(): RequestHandler {
    return async (req, res) => {
      const idCancha = Number(req.params["idCancha"]);

      const cancha = await this.service.getCanchaByID(idCancha);

      res.status(200).json(cancha);
    };
  }

  putCancha(): RequestHandler {
    return async (req, res) => {
      const cancha: Cancha = {
        ...req.body,
      };

      const imagen = req.file;
      const canchaActualizada = await this.service.modificarCancha(
        cancha,
        imagen
      );
      res.status(200).json(canchaActualizada);
    };
  }

  postCancha(): RequestHandler {
    return async (req, res) => {
      const cancha: Cancha = {
        ...req.body,
      };

      const imagen = req.file;
      const canchaCreada = await this.service.crearCancha(cancha, imagen);
      res.status(201).json(canchaCreada);
    };
  }
}
