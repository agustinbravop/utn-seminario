import { RequestHandler } from "express";
import { EstablecimientoService } from "../services/establecimientos.js";
import {
  Establecimiento,
  establecimientoSchema,
} from "../models/establecimiento.js";
import { ForbiddenError } from "../utils/apierrors.js";
import { z } from "zod";

export const crearEstablecimientoSchema = establecimientoSchema.omit({
  id: true,
  urlImagen: true,
  eliminado: true,
});

export const modificarEstablecimientoSchema = establecimientoSchema.omit({
  urlImagen: true,
  id: true,
});

export const habilitarEstablecimientoSchema = z.object({
  habilitado: z.boolean(),
});

export const buscarEstablecimientoQuerySchema = z.object({
  nombre: z.string().optional(),
  provincia: z.string().optional(),
  localidad: z.string().optional(),
  disciplina: z.string().min(1).optional().catch(undefined),
  fecha: z.coerce.date().optional(),
  habilitado: z.coerce.boolean().optional().default(true).catch(true),
});

export class EstablecimientoHandler {
  private service: EstablecimientoService;
  constructor(service: EstablecimientoService) {
    this.service = service;
  }

  getAllEstablecimientos(): RequestHandler {
    return async (_req, res) => {
      const ests = await this.service.getAll();
      res.status(200).json(ests);
    };
  }

  postEstablecimiento(): RequestHandler {
    return async (_req, res) => {
      const est: Establecimiento = {
        ...res.locals.body,
        idAdministrador: Number(res.locals.idAdmin),
      };

      const estCreado = await this.service.crear(est);
      res.status(201).json(estCreado);
    };
  }

  getEstablecimientoByID(): RequestHandler {
    return async (req, res) => {
      const id = Number(req.params.idEst);

      const est = await this.service.getByID(id);
      res.status(200).json(est);
    };
  }

  getEstablecimientosByAdminID(): RequestHandler {
    return async (req, res) => {
      const idAdmin = Number(req.params.idAdmin);

      const ests = await this.service.getByAdminID(idAdmin);
      res.status(200).json(ests);
    };
  }

  getEstablecimientosEliminadosByAdminID(): RequestHandler {
    return async (req, res) => {
      const idAdmin = Number(req.params.idAdmin);

      const ests = await this.service.getDeletedByAdminID(idAdmin);
      res.status(200).json(ests);
    };
  }

  putEstablecimiento(): RequestHandler {
    return async (req, res) => {
      const est: Establecimiento = {
        ...res.locals.body,
        id: Number(req.params.idEst),
        // El `idAdministrador` es el `id` que recibimos en el JWT Payload.
        idAdministrador: res.locals.idAdmin,
      };

      const estModificado = await this.service.modificar(est);
      res.status(200).json(estModificado);
    };
  }

  patchImagenEstablecimiento(): RequestHandler {
    return async (req, res) => {
      const idEst = Number(req.params["idEst"]);
      const imagen = req.file;

      const estActualizado = await this.service.modificarImagen(idEst, imagen);
      res.status(200).json(estActualizado);
    };
  }

  patchHabilitarEstablecimiento(): RequestHandler {
    return async (req, res) => {
      const idEst = Number(req.params["idEst"]);
      const { habilitado } = res.locals.body;

      const estActualizado = await this.service.habilitar(idEst, habilitado);
      res.status(200).json(estActualizado);
    };
  }

  eliminarEstablecimiento(): RequestHandler {
    return async (req, res) => {
      const idEst = Number(req.params["idEst"]);

      const estEliminado = await this.service.eliminar(idEst);
      res.status(200).json(estEliminado);
    };
  }

  buscarEstablecimiento(): RequestHandler {
    return async (_req, res) => {
      const query = res.locals.query;
      const result = await this.service.buscar(query);
      res.status(200).json(result);
    };
  }

  /**
   * Valida que el param `idEst` corresponda a un establecimiento del `idAdmin` del JWT.
   * Este middleware **asume que el JWT del administrador ya fue autenticado.**
   *
   * Sirve para evitar que un administrador modifique un establecimiento que no le pertenece.
   */
  validateAdminOwnsEstablecimiento(): RequestHandler {
    return async (req, res, next) => {
      const idEst = Number(req.params.idEst);
      const est = await this.service.getByID(idEst);

      if (est.idAdministrador !== res.locals.idAdmin) {
        throw new ForbiddenError(
          "No puede alterar establecimientos de otro administrador"
        );
      }

      next();
    };
  }
}
