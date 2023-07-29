import { AdministradorRepository } from "../repositories/administrador.js";
import { Administrador } from "../models/administrador.js";

export interface AdministradorService {
  getAdministradorByID(id: Number): Promise<Administrador>;
}

export class AdministradorServiceImpl implements AdministradorService {
  private repo: AdministradorRepository;

  constructor(repository: AdministradorRepository) {
    this.repo = repository;
  }

  async getAdministradorByID(id: number): Promise<Administrador> {
    return await this.repo.getAdministradorByID(id);
  }
}
