import { Pago } from "../models/pago";
import { PagoRepository } from "../repositories/pagos";

export type BuscarPagosQuery = {
  idCancha?: number;
  idEst?: number;
  fechaDesde?: string;
  fechaHasta?: string;
};

export interface PagoService {
  getByID(idRes: number): Promise<Pago>;
  buscar(filtros: BuscarPagosQuery): Promise<Pago[]>;
  crearSub():Promise<any>;
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

  async crearSub() {
    const url = "https://api.mercadopago.com/preapproval";
  
    const body = {
      reason: "Test-1",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: 39,
        currency_id: "ARS"
      },
      back_url: "https://api.mercadopago.com.ar",
      payer_email: "test_user_46945293@testuser.com",
      status: "pending"
    };
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer APP_USR-3657901561842376-102414-c4f093ffa9563fef1717d0bf429bc6f4-1521790373`
      },
      body: JSON.stringify(body)
    });
    if (response.ok) {
      const subscription = await response.json();
      console.log(subscription)
      return subscription;
    } else {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
    }
  
  }

}
