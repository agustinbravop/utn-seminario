import { Pago } from "../models/pago.js";
import { PagoRepository } from "../repositories/pagos.js";

export type BuscarPagosQuery = {
  idCancha?: number;
  idEst?: number;
  fechaDesde?: string;
  fechaHasta?: string;
};

export interface PagoService {
  getByID(idRes: number): Promise<Pago>;
  buscar(filtros: BuscarPagosQuery): Promise<Pago[]>;
}

export class PagoServiceImpl implements PagoService {
  private repo: PagoRepository;

  constructor(repository: PagoRepository) {
    this.repo = repository;
  }
  async getByID(idPago: number) {
    return await this.repo.getByID(idPago);
  }
  async buscar(filtros: BuscarPagosQuery) {
    return await this.repo.buscar(filtros);
  }
}
