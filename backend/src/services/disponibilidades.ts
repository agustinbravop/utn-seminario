import { Disponibilidad } from "../models/disponibilidad.js";
import { DisponibilidadRepository } from "../repositories/disponibilidades";
import { ConflictError } from "../utils/apierrors.js";
import { horaADecimal } from "../utils/dates.js";

export interface DisponibilidadService {
  getByCanchaID(idCancha: number): Promise<Disponibilidad[]>;
  getByID(idDisp: number): Promise<Disponibilidad>;
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

  async getByID(idDisp: number) {
    return await this.repo.getByID(idDisp);
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
   * Valida que dos disponibilidades no se solapen en una disciplina, día y horario. */
  async validar(disp: Disponibilidad) {
    let disponibilidades = await this.repo.getByCanchaID(disp.idCancha);
    disponibilidades = disponibilidades
      // Dos disponibilidades se solapan si tienen la misma disciplina,
      .filter((d) => d.disciplina === disp.disciplina)
      // En el mismo día de la semana,
      .filter((d) => d.dias.some((dia) => disp.dias.includes(dia)))
      // Y una comienza antes que la otra termine,
      .filter((d) => horaADecimal(d.horaInicio) < horaADecimal(disp.horaFin))
      // Pero también termina una vez comenzada la otra
      .filter((d) => horaADecimal(d.horaFin) > horaADecimal(disp.horaInicio));

    if (disponibilidades.length !== 0) {
      throw new ConflictError(
        "Los horarios se solapan con otras disponibilidades"
      );
    }
  }
}
