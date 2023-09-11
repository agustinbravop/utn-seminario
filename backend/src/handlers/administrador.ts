import { RequestHandler } from "express";
import { AdministradorServiceImpl } from "../services/administrador.js";
import { Administrador, administradorSchema } from "../models/administrador.js";

export const modificarAdministradorSchema = administradorSchema.deepPartial();
export class AdministradorHandler {
  private service: AdministradorServiceImpl;

  constructor(client: AdministradorServiceImpl) {
    this.service = client;
  }

  getAdministradorByID(): RequestHandler {
    return async (_req, res) => {
      const idAdmin = Number(res.locals.idAdmin);
      const result = await this.service.getAdministradorByID(idAdmin);
      res.status(200).json(result);
    };
  }

  patchAdmin(): RequestHandler {
    return async (req, res) => {
      const admin: Administrador = {
        ...res.locals.body,
        id: Number(req.params["idAdmin"]),
      };
      const adminActualizado = await this.service.modificar(admin);
      res.status(200).json(adminActualizado);
    };
  }
}
