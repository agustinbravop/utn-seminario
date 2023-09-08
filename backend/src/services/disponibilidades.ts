import { Disponibilidad } from "../models/disponibilidad.js";
import { DisponibilidadRepository } from "../repositories/disponibilidades.js";

export interface DisponibilidadService {
  getByCanchaID(idCancha: number): Promise<Disponibilidad[]>;
  getByID(idDisp: number): Promise<Disponibilidad>;
  crear(disp: Disponibilidad): Promise<Disponibilidad>;
  modificar(disp: Disponibilidad): Promise<Disponibilidad>;
  eliminar(idDisp: number): Promise<Disponibilidad>;
}

export class DisponibilidadServiceimpl implements DisponibilidadService {
  private repo: DisponibilidadRepository;

  constructor(service: DisponibilidadRepository) {
    this.repo = service;
  }

  async getByCanchaID(idCancha: number) {
    return await this.repo.getDisponibilidadesByCanchaID(idCancha);
  }

  async getByID(idDisp: number) {
    return await this.repo.getDisponibilidadByID(idDisp);
  }

  async crear(disp: Disponibilidad) {
    return await this.repo.crearDisponibilidad(disp);
  }

  async modificar(disp: Disponibilidad) {
    return await this.repo.modificarDisponibilidad(disp);
  }

  async eliminar(idDisp: number) {
    return await this.repo.eliminarDisponibilidad(idDisp);
  }
}
