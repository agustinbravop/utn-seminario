import { Disponibilidad } from "../models/disponibilidad";
import { Reserva } from "../models/reserva";
import { CanchaRepository } from "../repositories/canchas";
import { DisponibilidadRepository } from "../repositories/disponibilidades";
import { ReservaRepository } from "../repositories/reservas";
import { ConflictError } from "../utils/apierrors";
import { getDayOfWeek } from "../utils/dates";

export type CrearReserva = {
  fechaReservada: Date;
  idJugador: number;
  idDisponibilidad: number;
};

export interface ReservaService {
  getByEstablecimientoID(idEst: number): Promise<Reserva[]>;
  getByDisponibilidadID(idDisp: number): Promise<Reserva[]>;
  getByJugadorID(idJugador: number): Promise<Reserva[]>;
  getByID(idRes: number): Promise<Reserva>;
  crear(res: CrearReserva): Promise<Reserva>;
}

export class ReservaServiceImpl implements ReservaService {
  private repo: ReservaRepository;
  private canchaRepository: CanchaRepository;
  private dispRepository: DisponibilidadRepository;

  constructor(
    repository: ReservaRepository,
    canchaRepository: CanchaRepository,
    dispRepository: DisponibilidadRepository
  ) {
    this.repo = repository;
    this.canchaRepository = canchaRepository;
    this.dispRepository = dispRepository;
  }

  async getByEstablecimientoID(idEst: number) {
    return await this.repo.getReservasByEstablecimientoID(idEst);
  }

  async getByDisponibilidadID(idDisp: number) {
    return await this.repo.getReservasByDisponibilidadID(idDisp);
  }

  async getByJugadorID(idJugador: number) {
    return await this.repo.getReservasByJugadorID(idJugador);
  }

  async getByID(idRes: number) {
    return await this.repo.getReservaByID(idRes);
  }

  async crear(crearReserva: CrearReserva) {
    await this.validarCanchaHabilitada(crearReserva);
    await this.validarDisponibilidadLibre(crearReserva);

    const disp = await this.dispRepository.getByID(
      crearReserva.idDisponibilidad
    );
    await this.validarDiaDeSemana(crearReserva, disp);

    return await this.repo.crearReserva({
      ...crearReserva,
      precio: disp.precioReserva,
    });
  }

  /** Lanza error al intentar reservar una cancha deshabilitada o eliminada. */
  private async validarCanchaHabilitada(res: CrearReserva) {
    const cancha = await this.canchaRepository.getByDisponibilidadID(
      res.idDisponibilidad
    );
    if (!cancha.habilitada || cancha.eliminada) {
      throw new ConflictError(
        `La disponibilidad ${res.idDisponibilidad} es de una cancha deshabilitada o eliminada`
      );
    }
  }

  /** Lanza error al intentar reservar una disponibilidad ya reservada en la fecha dada. */
  private async validarDisponibilidadLibre(res: CrearReserva) {
    const yaFueReservada = await this.repo.existsReservaByDate(
      res.idDisponibilidad,
      res.fechaReservada
    );
    if (yaFueReservada) {
      throw new ConflictError(
        `La disponibilidad ${res.idDisponibilidad} ya fue reservada en la fecha ${res.fechaReservada}`
      );
    }
  }

  /** Lanza error al intentar reservar una disponibilidad en un día de la semana no habilitado. */
  private async validarDiaDeSemana(res: CrearReserva, disp: Disponibilidad) {
    const dia = getDayOfWeek(res.fechaReservada);
    if (!disp.dias.includes(dia)) {
      throw new ConflictError(
        `La disponibilidad ${res.idDisponibilidad} solo está disponible los días ${disp.dias}`
      );
    }
  }
}
