import { AdministradorRepository } from "../repositories/administrador.js";
import { Administrador } from "../models/administrador.js";

export interface AdministradorService {
  getByID(id: Number): Promise<Administrador>;
  modificar(admin: Administrador): Promise<Administrador>;
}

export class AdministradorServiceImpl implements AdministradorService {
  private repo: AdministradorRepository;

  constructor(repository: AdministradorRepository) {
    this.repo = repository;
  }

  async modificar(admin: Administrador): Promise<Administrador> {
    return await this.repo.modificarAdministrador(admin);
  }

  async getByID(id: number): Promise<Administrador> {
    return await this.repo.getAdministradorByID(id);
  }
}
