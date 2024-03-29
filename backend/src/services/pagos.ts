import { PagoConReserva } from "../models/pago.js";
import { PagoRepository } from "../repositories/pagos.js";

export type BuscarPagosQuery = {
  idCancha?: number;
  idEst?: number;
  fechaDesde?: Date;
  fechaHasta?: Date;
};

export interface PagoService {
  getByID(idRes: number): Promise<PagoConReserva>;
  buscar(filtros: BuscarPagosQuery): Promise<PagoConReserva[]>;
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
