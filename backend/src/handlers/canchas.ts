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
    id: true,
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

      cancha.match(
        (cancha) => res.status(200).json(cancha),
        (err) => res.status(err.status).json(err)
      );
    };
  }

  getCanchaByID(): RequestHandler {
    return async (req, res) => {
      const idCancha = Number(req.params["idCancha"]);

      const cancha = await this.service.getCanchaByID(idCancha);

      cancha.match(
        (cancha) => res.status(200).json(cancha),
        (err) => res.status(err.status).json(err)
      );
    };
  }

  putCancha(): RequestHandler {
    return async (req, res) => {
      const cancha: Cancha = {
        // ...req.body,  Acá se parsea los datos del body como debe ser ya que todos venía como string
        id: parseInt(req.body.id),
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        estaHabilitada: (req.body.estaHabilitada === "true"),
        urlImagen: req.body.urlImagen,
        idEstablecimiento: parseInt(req.body.idEstablecimiento),
        disciplinas: req.body.disciplinas
      }
      const imagen = req.file;
      const canchaActualizada = await this.service.modificarCancha(
        cancha,
        imagen
      );

      canchaActualizada.match(
        (canchaAct) => res.status(200).json(canchaAct),
        (err) => res.status(err.status).json(err)
      );
    };
  }

  postCancha(): RequestHandler {
    return async (req, res) => {
      const cancha: Cancha = {
        ...req.body,
      };

      const imagen = req.file;
      const canchaResult = await this.service.crearCancha(cancha, imagen);
      canchaResult.match(
        (nuevaCancha) => res.status(201).json(nuevaCancha),
        (err) => res.status(err.status).json(err)
      );
    };
  }
}
