import { RequestHandler } from "express";
import { AdministradorServiceImpl } from "../services/administrador";

export class AdministradorHandler {
  private service: AdministradorServiceImpl;

  constructor(client: AdministradorServiceImpl) {
    this.service = client;
  }

  getAdministradorByID(): RequestHandler {
    return async (req, res) => {
      const idAdmin = Number(req.params["idAdmin"]);
      const admin = await this.service.getAdministradorByID(idAdmin);
      res.status(200).json(admin);
    };
  }
}
