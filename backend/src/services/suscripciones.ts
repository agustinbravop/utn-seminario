import { SuscripcionRepository } from "../repositories/suscripciones.js";
import { Suscripcion } from "../models/suscripcion.js";

export interface SuscripcionService {
  getByID(id: number): Promise<Suscripcion>;
  getAll(): Promise<Suscripcion[]>;
}

export class SuscripcionServiceImpl implements SuscripcionService {
  private repo: SuscripcionRepository;

  constructor(repository: SuscripcionRepository) {
    this.repo = repository;
  }

  async getByID(id: number): Promise<Suscripcion> {
    return await this.repo.getSuscripcionByID(id);
  }

  async getAll(): Promise<Suscripcion[]> {
    return await this.repo.getAllSuscripciones();
  }
}
