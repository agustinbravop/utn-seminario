import { SuscripcionRepository } from "../repositories/suscripciones.js";
import { Result } from "neverthrow";
import { ApiError } from "../utils/apierrors.js";
import { Suscripcion } from "../models/suscripcion.js";

export interface SuscripcionService {
  getSuscripcionByID(id: number): Promise<Result<Suscripcion, ApiError>>;
  getAllSuscripciones(): Promise<Result<Suscripcion[], ApiError>>;
}

export class SuscripcionServiceImpl {
  private repo: SuscripcionRepository;

  constructor(repository: SuscripcionRepository) {
    this.repo = repository;
  }

  async getSuscripcionByID(id: number): Promise<Result<Suscripcion, ApiError>> {
    return await this.repo.getSuscripcionByID(id);
  }

  async getAllSuscripciones(): Promise<Result<Suscripcion[], ApiError>> {
    console.log("-> service");
    return await this.repo.getAllSuscripciones();
  }
}
