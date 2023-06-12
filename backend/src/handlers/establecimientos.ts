import { RequestHandler } from "express";
import { EstablecimientoService } from "../services/establecimientos.js";
import { Establecimiento } from "../models/establecimiento.js";

export class EstablecimientoHandler {
  private service: EstablecimientoService;

  constructor(service: EstablecimientoService) {
    this.service = service;
  }

  crearEstablecimiento(): RequestHandler {
    return async (req, res) => {
      const est: Establecimiento = {
        ...req.body,
        id: 0,
      };
      const imagen = req.file;
      const estResult = await this.service.crearEstablecimiento(est, imagen);

      estResult.match(
        (est) => res.status(201).json(est),
        (err) => res.status(err.status).json(err)
      );
    };
  }

  getByAdminID(): RequestHandler {
    return async (req, res) => {
      // TODO: mejorar input validation
      const idAdmin = Number(req.params.idAdmin);
      const estsResult = await this.service.getByAdministradorID(idAdmin);
      estsResult.match(
        (ests) => res.status(200).json(ests),
        (err) => res.status(err.status).json(err)
      );
    };
  }
}
