import { Disponibilidad } from "../models/disponibilidad.js";
import { DisponibilidadRepository } from "../repositories/disponibilidades";
import { BadRequestError, ConflictError } from "../utils/apierrors.js";
import { horaADecimal } from "../utils/dates.js";

export type BuscarDisponibilidadesQuery = {
  idCancha?: number;
  idEst?: number;
};

export interface DisponibilidadService {
  getByCanchaID(idCancha: number): Promise<Disponibilidad[]>;
  getByAdminID(idAdmin: number): Promise<Disponibilidad[]>;
  getByID(idDisp: number): Promise<Disponibilidad>;
  buscar(filtros: BuscarDisponibilidadesQuery): Promise<Disponibilidad[]>;
  crear(disp: Disponibilidad): Promise<Disponibilidad>;
  modificar(disp: Disponibilidad): Promise<Disponibilidad>;
  eliminar(idDisp: number): Promise<Disponibilidad>;
}

export class DisponibilidadServiceimpl implements DisponibilidadService {
  private repo: DisponibilidadRepository;

  constructor(repository: DisponibilidadRepository) {
    this.repo = repository;
  }

  async getByCanchaID(idCancha: number) {
    return await this.repo.getByCanchaID(idCancha);
  }

  async getByAdminID(idAdmin: number) {
    return await this.repo.getByAdminID(idAdmin);
  }

  async getByID(idDisp: number) {
    return await this.repo.getByID(idDisp);
  }

  async buscar(filtros: BuscarDisponibilidadesQuery) {
    return await this.repo.buscar(filtros);
  }

  async crear(disp: Disponibilidad) {
    await this.validar(disp);

    return await this.repo.crear(disp);
  }

  async modificar(disp: Disponibilidad) {
    await this.validar(disp);

    return await this.repo.modificar(disp);
  }

  async eliminar(idDisp: number) {
    return await this.repo.eliminar(idDisp);
  }

  /**
   * Valida que una disponibilidad no tenga conflictos con el resto de disponibilidades.
   */
  async validar(disp: Disponibilidad) {
    if (horaADecimal(disp.horaInicio) > horaADecimal(disp.horaFin)) {
      throw new BadRequestError(
        "La disponibilidad debe tener un horario de inicio previo al de fin"
      );
    }

    const disponibilidades = await this.repo.getByCanchaID(disp.idCancha);
    for (const d of disponibilidades) {
      if (
        // Dos disponibilidades se solapan si tienen la misma disciplina,
        d.disciplina === disp.disciplina &&
        // en el mismo día de la semana,
        d.dias.some((dia) => disp.dias.includes(dia)) &&
        // y una comienza antes de que la otra termine,
        horaADecimal(d.horaInicio) < horaADecimal(disp.horaFin) &&
        // pero también termina después de que la otra haya comenzado.
        horaADecimal(d.horaFin) > horaADecimal(disp.horaInicio)
      ) {
        throw new ConflictError("El horario se solapa con otra disponibilidad");
      }
    }
  }
}
