import { Pago } from "../models/pago";
import { PagoRepository } from "../repositories/pagos";

export type Filtros = {
  idCancha?: number;
  idEst?: number;
};

export interface PagoService {
  getByID(idRes: number): Promise<Pago>;
  buscar(filtros: Filtros): Promise<Pago[]>;
}

export class PagoServiceImpl implements PagoService {
  private repo: PagoRepository;

  constructor(repository: PagoRepository) {
    this.repo = repository;
  }
  async getByID(idPago: number) {
    return await this.repo.getByID(idPago);
  }
  async buscar(filtros: Filtros) {
    return await this.repo.buscar(filtros);
  }
}
