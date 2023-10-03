import Decimal from "decimal.js";
import { Disponibilidad } from "../models/disponibilidad";
import { Reserva } from "../models/reserva";
import { CanchaRepository } from "../repositories/canchas";
import { DisponibilidadRepository } from "../repositories/disponibilidades";
import { PagoRepository } from "../repositories/pago";
import { ReservaRepository } from "../repositories/reservas";
import { ConflictError, InternalServerError } from "../utils/apierrors";
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
  pagarSenia(res: Reserva): Promise<Reserva>;
  pagarReserva(res: Reserva): Promise<Reserva>;
}

export class ReservaServiceImpl implements ReservaService {
  private repo: ReservaRepository;
  private canchaRepository: CanchaRepository;
  private dispRepository: DisponibilidadRepository;
  private pagoRepo: PagoRepository;

  constructor(
    repository: ReservaRepository,
    canchaRepository: CanchaRepository,
    dispRepository: DisponibilidadRepository,
    pagoRepo: PagoRepository
  ) {
    this.repo = repository;
    this.canchaRepository = canchaRepository;
    this.dispRepository = dispRepository;
    this.pagoRepo = pagoRepo;
  }

  async pagarSenia(res: Reserva): Promise<Reserva> {
    if (!res.disponibilidad.precioSenia) {
      throw new Error(
        `La disponibilidad ${res.disponibilidad.id} no admite señas`
      );
    }
    if (res.pagoSenia) {
      throw new Error("Reserva con seña existente");
    }
    try {
      const pago = await this.pagoRepo.crearPago(
        new Decimal(res.disponibilidad.precioSenia), //???
        "Efectivo"
      );
      res.pagoSenia = pago.id;
      return await this.repo.updateReserva(res);
    } catch (e) {
      throw new InternalServerError("Error al registrar el pago de la seña");
    }
  }

  async pagarReserva(res: Reserva): Promise<Reserva> {
    if (res.pagoReserva) {
      throw new Error("Reserva con pago existente");
    }
    try {
      var monto = new Decimal(0);
      if (res.pagoSenia) {
        const precioDecimal = new Decimal(res.precio);
        const pagoSeniaDecimal = new Decimal(
          res.disponibilidad.precioSenia ? res.disponibilidad.precioSenia : 0
        );
        monto = precioDecimal.minus(pagoSeniaDecimal);
      } else {
        monto = new Decimal(res.precio);
      }
      const pago = await this.pagoRepo.crearPago(monto, "Efectivo");
      res.pagoReserva = pago.id;
      return await this.repo.updateReserva(res);
    } catch (e) {
      throw new InternalServerError("Error al registrar el pago de la reserva");
    }
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
        `La disponibilidad es de una cancha deshabilitada o eliminada`
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
        `La disponibilidad ya fue reservada en la fecha ${res.fechaReservada}`
      );
    }
  }

  /** Lanza error al intentar reservar una disponibilidad en un día de la semana no habilitado. */
  private async validarDiaDeSemana(res: CrearReserva, disp: Disponibilidad) {
    const dia = getDayOfWeek(res.fechaReservada);
    if (!disp.dias.includes(dia)) {
      throw new ConflictError(
        `La disponibilidad de ${disp.horaInicio} a ${disp.horaFin} solo está disponible los días ${disp.dias}`
      );
    }
  }
}
