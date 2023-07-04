import { RequestHandler } from "express";
import { EstablecimientoService } from "../services/establecimientos.js";
import { Establecimiento } from "../models/establecimiento.js";
import { z } from "zod";
import { ApiError } from "../utils/apierrors.js";

export const crearEstablecimientoReqSchema = z.object({
  nombre: z.string().nonempty(),
  correo: z.string().nonempty().email(),
  telefono: z.string().nonempty().max(15),
  direccion: z.string().nonempty(),
  localidad: z.string().nonempty(),
  provincia: z.string().nonempty(),
  imagen: z.custom<Express.Multer.File>().optional(),
  idAdministrador: z.string().transform((idAdm) => Number(idAdm)),
  horariosDeAtencion: z.string().nonempty().nullable(),
});

export class EstablecimientoHandler {
  private service: EstablecimientoService;
  constructor(service: EstablecimientoService) {
    this.service = service;
  }

  postEstablecimiento(): RequestHandler {
    return async (req, res) => {
      const est: Establecimiento = {
        ...res.locals.body,
        idAdministrador: res.locals.idAdmin,
        id: 0,
      };
      const imagen = req.file;

      const estResult = await this.service.crear(est, imagen);
      estResult.match(
        (est) => res.status(201).json(est),
        (err) => res.status(err.status).json(err)
      );
    };
  }

  getEstablecimientoByID(): RequestHandler {
    return async (req, res) => {
      // TODO: mejorar input validation
      const id = Number(req.params.idEst);
      const estResult = await this.service.getByID(id);
      estResult.match(
        (est) => res.status(200).json(est),
        (err) => res.status(err.status).json(err)
      );
    };
  }

  getEstablecimientosByAdminID(): RequestHandler {
    return async (req, res) => {
      // TODO: mejorar input validation
      const idAdmin = Number(req.params.idAdmin);
      const estsResult = await this.service.getByAdminID(idAdmin);
      estsResult.match(
        (ests) => res.status(200).json(ests),
        (err) => res.status(err.status).json(err)
      );
    };
  }

  putEstablecimiento(): RequestHandler {
    return async (req, res) => {
      const est: Establecimiento = {
        ...req.body,
        // El `idAdministrador` es el `id` que recibimos en el JWT Payload.
        idAdministrador: res.locals.idAdmin,
      };
      const imagen = req.file;

      const estResult = await this.service.modificar(est, imagen);
      estResult.match(
        (est) => res.status(200).json(est),
        (err) => res.status(err.status).json(err)
      );
    };
  }

  /**
   * Valida que el idEst de los params corresponda a un establecimiento del idAdmin del JWT.
   */
  validateAdminOwnsEstablecimiento(): RequestHandler {
    return async (req, res, next) => {
      const idEst = Number(req.params.idEst);
      const est = (await this.service.getByID(idEst)).unwrapOr(null);
      if (est === null) {
        return res
          .status(404)
          .json(new ApiError(404, `No existe establecimiento con id ${idEst}`));
      }

      if (est.idAdministrador !== res.locals.idAdmin) {
        return res
          .status(403)
          .json(
            new ApiError(
              403,
              "No puede alterar establecimientos de otro administrador"
            )
          );
      }

      next();
    };
  }
}
