import { CanchaService } from "../services/canchas";
import { RequestHandler } from "express";
import { Cancha, canchaSchema } from "../models/cancha";

export const crearCanchaReqSchema = canchaSchema.omit({
  id: true,
  urlImagen: true,
});

export const modificarCanchaReqSchema = canchaSchema.omit({
  urlImagen: true,
});

export class CanchaHandler {
  private service: CanchaService;

  constructor(service: CanchaService) {
    this.service = service;
  }

  getCanchasByEstablecimientoID(): RequestHandler {
    return async (req, res) => {
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
        ...req.body,
      };

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
        (nuevaCancha) => res.status(200).json(nuevaCancha),
        (err) => res.status(err.status).json(err)
      );
    };
  }
}
