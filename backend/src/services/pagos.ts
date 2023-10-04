import { Pago } from "../models/pago";
import { PagoRepository } from "../repositories/pagos";

export type BuscarPagoQuery = {
  idCancha?: number;
  idEst?: number;
  fechaDesde?: string;
  fechaHasta?: string;
};

export interface PagoService {
  getByID(idRes: number): Promise<Pago>;
  buscar(filtros: BuscarPagoQuery): Promise<Pago[]>;
}

export class PagoServiceImpl implements PagoService {
  private repo: PagoRepository;

  constructor(repository: PagoRepository) {
    this.repo = repository;
  }
  async getByID(idPago: number) {
    return await this.repo.getByID(idPago);
  }
  async buscar(filtros: BuscarPagoQuery) {
    return await this.repo.buscar(filtros);
  }
}
