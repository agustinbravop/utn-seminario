import { RequestHandler } from "express";
import { AdministradorServiceImpl } from "../services/administrador";
import { Administrador } from "../models/administrador";

export class AdministradorHandler {
  private service: AdministradorServiceImpl;

  constructor(client: AdministradorServiceImpl) {
    this.service = client;
  }

  getAdministradorByID(): RequestHandler {
    return async (req, res) => {
      const idAdmin = Number(req.params["idAdmin"]);
      const result = await this.service.getAdministradorByID(idAdmin);
      res.status(200).json(result);
    };
  }

  patchAdmin(): RequestHandler {
    return async (req, res) => {
      const admin: Administrador = {
        ...res.locals.body,
      };
      admin.id = Number(req.params["idAdmin"]);
      const adminActualizado = await this.service.modificar(admin);
      res.status(200).json(adminActualizado);
    };
  }
}
