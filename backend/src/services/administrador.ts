import { Result } from "neverthrow";
import { ApiError } from "../utils/apierrors.js";
import { AdministradorRepository } from "../repositories/administrador.js";
import { Administrador } from "../models/administrador.js";

export interface AdministradorService {
  getAdministradorByID(id: Number): Promise<Result<Administrador, ApiError>>;
}

export class AdministradorServiceImpl implements AdministradorService {
  private repo: AdministradorRepository;

  constructor(repository: AdministradorRepository) {
    this.repo = repository;
  }

  async getAdministradorByID(
    id: number
  ): Promise<Result<Administrador, ApiError>> {
    return await this.repo.getAdministradorByID(id);
  }
}
