import { RequestHandler } from "express";
import { EstablecimientoService } from "../services/establecimientos.js";
import {
  Establecimiento,
  establecimientoSchema,
} from "../models/establecimiento.js";
import { ForbiddenError } from "../utils/apierrors.js";
import { z } from "zod";

export const crearEstablecimientoReqSchema = establecimientoSchema
  .omit({
    id: true,
    urlImagen: true,
  })
  .extend({
    idAdministrador: z.string().transform((str) => {
      console.log(typeof str, str, Number(str));
      return Number(str);
    }),
  });

export const modificarEstablecimientoReqSchema = establecimientoSchema
  .omit({
    urlImagen: true,
  })
  .extend({
    idAdministrador: z.string().transform((str) => Number(str)),
  });

export class EstablecimientoHandler {
  private service: EstablecimientoService;
  constructor(service: EstablecimientoService) {
    this.service = service;
  }

  postEstablecimiento(): RequestHandler {
    return async (req, res) => {
      console.log(res.locals);

      const est: Establecimiento = {
        ...res.locals.body,
        idAdministrador: Number(res.locals.idAdmin),
        id: 0,
      };
      const imagen = req.file;

      const estCreado = await this.service.crear(est, imagen);
      res.status(201).json(estCreado);
    };
  }

  getEstablecimientoByID(): RequestHandler {
    return async (req, res) => {
      // TODO: mejorar input validation
      const id = Number(req.params.idEst);
      const est = await this.service.getByID(id);
      res.status(200).json(est);
    };
  }

  getEstablecimientosByAdminID(): RequestHandler {
    return async (req, res) => {
      // TODO: mejorar input validation
      const idAdmin = Number(req.params.idAdmin);
      const ests = await this.service.getByAdminID(idAdmin);
      res.status(200).json(ests);
    };
  }

  putEstablecimiento(): RequestHandler {
    return async (req, res) => {
      const est: Establecimiento = {
        ...res.locals.body,
        // El `idAdministrador` es el `id` que recibimos en el JWT Payload.
        idAdministrador: res.locals.idAdmin,
      };
      const imagen = req.file;

      const estModificado = await this.service.modificar(est, imagen);
      res.status(200).json(estModificado);
    };
  }

  /**
   * Valida que el idEst de los params corresponda a un establecimiento del idAdmin del JWT.
   * **Asume que el JWT del administrador ya fue autenticado.**
   * Se usa para prevenir que un administrador modifique un establecimiento que no le pertenece.
   */
  validateAdminOwnsEstablecimiento(): RequestHandler {
    return async (req, res, next) => {
      const idEst = Number(req.params.idEst);
      const est = await this.service.getByID(idEst);

      if (est.idAdministrador !== res.locals.idAdmin) {
        return res
          .status(403)
          .json(
            new ForbiddenError(
              "No puede alterar establecimientos de otro administrador"
            )
          );
      }

      next();
    };
  }
}
