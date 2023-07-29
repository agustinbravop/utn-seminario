import { SuscripcionRepository } from "../repositories/suscripciones.js";
import { Suscripcion } from "../models/suscripcion.js";

export interface SuscripcionService {
  getSuscripcionByID(id: number): Promise<Suscripcion>;
  getAllSuscripciones(): Promise<Suscripcion[]>;
}

export class SuscripcionServiceImpl implements SuscripcionService {
  private repo: SuscripcionRepository;

  constructor(repository: SuscripcionRepository) {
    this.repo = repository;
  }

  async getSuscripcionByID(id: number): Promise<Suscripcion> {
    return await this.repo.getSuscripcionByID(id);
  }

  async getAllSuscripciones(): Promise<Suscripcion[]> {
    return await this.repo.getAllSuscripciones();
  }
}
