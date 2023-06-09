import bcrypt from "bcrypt";
import { SuscripcionRepository } from "../repositories/suscripcion";
import { Result, ok, err } from "neverthrow";
import { ApiError } from "../utils/apierrors";
import { Suscripcion } from "../models/suscripcion";

export interface SuscripcionService {
  getSuscripcionByID(id: number): Promise<Result<Suscripcion, ApiError>>;
  getAllSuscripciones(): Promise<Result<Suscripcion[], ApiError>>;
}

export class SuscripcionServiceImpl {
  repo: SuscripcionRepository;

  constructor(repository: SuscripcionRepository) {
    this.repo = repository;
  }

  async getSuscripcionByID(id: number): Promise<Result<Suscripcion, ApiError>> {
    return await this.repo.getSuscripcionByID(id);
  }

  async getAllSuscripciones(): Promise<Result<Suscripcion[], ApiError>> {
    return await this.repo.getAllSuscripciones();
  }
}
