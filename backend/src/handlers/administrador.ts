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
      const result = await this.service.getAdministradorByID(idAdmin);
      result.match(
        (admin) => res.status(200).json(admin),
        (err) => res.status(err.status).json(err)
      );
    };
  }
}
