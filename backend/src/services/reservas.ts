import Decimal from "decimal.js";
import { Disponibilidad } from "../models/disponibilidad.js";
import { Reserva } from "../models/reserva.js";
import { CanchaRepository } from "../repositories/canchas.js";
import { DisponibilidadRepository } from "../repositories/disponibilidades.js";
import { PagoRepository } from "../repositories/pagos.js";
import { ReservaRepository } from "../repositories/reservas.js";
import { ConflictError } from "../utils/apierrors.js";
import { getDiaDeSemana, setHora, toUTC } from "../utils/dates.js";
import { MetodoDePago } from "../models/pago.js";

export type CrearReserva = {
  fechaReservada: Date;
  idJugador?: number;
  jugadorNoRegistrado?: string;
  idDisponibilidad: number;
};

export type BuscarReservaQuery = {
  idCancha?: number;
  idEst?: number;
  fechaCreadaDesde?: Date;
  fechaCreadaHasta?: Date;
  fechaReservadaDesde?: Date;
  fechaReservadaHasta?: Date;
};

export interface ReservaService {
  getByEstablecimientoID(idEst: number): Promise<Reserva[]>;
  getByDisponibilidadID(idDisp: number): Promise<Reserva[]>;
  getByJugadorID(idJugador: number): Promise<Reserva[]>;
  getByCanchaID(idCancha: number): Promise<Reserva[]>;
  getByID(idRes: number): Promise<Reserva>;
  buscar(filtros: BuscarReservaQuery): Promise<Reserva[]>;
  crear(res: CrearReserva): Promise<Reserva>;
  pagarSenia(idRes: number): Promise<Reserva>;
  pagarReserva(idRes: number): Promise<Reserva>;
  cancelarReserva(idRes: number): Promise<Reserva>;
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

  async pagarSenia(idRes: number) {
    const res = await this.repo.getReservaByID(idRes);

    if (!res.disponibilidad.precioSenia) {
      throw new Error(
        `La disponibilidad ${res.disponibilidad.id} no admite señas`
      );
    }
    if (res.pagoSenia) {
      throw new Error("Reserva con seña ya existente");
    }
    if (res.cancelada) {
      throw new ConflictError("No se puede señar una reserva cancelada");
    }

    // TODO: congelar en `reserva` el valor de la seña al momento de la reservación.
    const pago = await this.pagoRepo.crear(
      new Decimal(res.disponibilidad.precioSenia),
      MetodoDePago.Efectivo
    );
    res.pagoSenia = pago;
    return await this.repo.updateReserva(res);
  }

  async pagarReserva(idRes: number): Promise<Reserva> {
    const res = await this.repo.getReservaByID(idRes);

    if (res.pagoReserva) {
      throw new ConflictError("Reserva con pago ya existente");
    }
    if (res.cancelada) {
      throw new ConflictError("No se puede pagar una reserva cancelada");
    }

    let monto = new Decimal(res.precio);
    if (res.pagoSenia) {
      // Si la seña ya fue pagada, se descuenta ese valor del precio total.
      monto = monto.minus(new Decimal(res.pagoSenia.monto));
    }
    const pago = await this.pagoRepo.crear(monto, MetodoDePago.Efectivo);
    res.pagoReserva = pago;
    return await this.repo.updateReserva(res);
  }

  async cancelarReserva(idReserva: number): Promise<Reserva> {
    const res = await this.repo.getReservaByID(idReserva);
    // TODO: validaciones para no poder cancelar cualquier reserva.
    return await this.repo.updateReserva({ ...res, cancelada: true });
  }

  async getByEstablecimientoID(idEst: number) {
    return await this.repo.getReservasByEstablecimientoID(idEst);
  }

  async getByDisponibilidadID(idDisp: number) {
    return await this.repo.getReservasByDisponibilidadID(idDisp);
  }

  async getByCanchaID(idCancha: number) {
    return await this.repo.getReservasByCanchaID(idCancha);
  }

  async getByJugadorID(idJugador: number) {
    return await this.repo.getReservasByJugadorID(idJugador);
  }

  async getByID(idRes: number) {
    return await this.repo.getReservaByID(idRes);
  }

  async buscar(filtros: BuscarReservaQuery) {
    return await this.repo.buscar(filtros);
  }

  async crear(crearReserva: CrearReserva) {
    await this.validarCanchaHabilitada(crearReserva);

    const disp = await this.dispRepository.getByID(
      crearReserva.idDisponibilidad
    );
    await this.validarDisponibilidadLibre(crearReserva, disp);
    await this.validarDiaDeSemana(crearReserva, disp);
    this.validarFechaFutura(crearReserva, disp);

    return await this.repo.crearReserva({
      ...crearReserva,
      jugadorNoRegistrado: crearReserva.jugadorNoRegistrado,
      precio: disp.precioReserva,
      senia: disp.precioSenia,
    });
  }

  /** Lanza un error al intentar reservar una cancha deshabilitada o eliminada. */
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

  /** Lanza un error al intentar reservar una disponibilidad ya reservada en la fecha dada. */
  private async validarDisponibilidadLibre(
    res: CrearReserva,
    disp: Disponibilidad
  ) {
    // Se obtienen todas las reservas de esta cancha en la fecha a reservar...
    const reservasMismaFecha = await this.buscar({
      idCancha: disp.idCancha,
      fechaReservadaDesde: res.fechaReservada,
      fechaReservadaHasta: res.fechaReservada,
    });
    // ...para validar que ninguna de esas reservas se solape con la nueva.
    const horarioSolapado = reservasMismaFecha.some(
      (r) =>
        r.disponibilidad.horaFin > disp.horaInicio &&
        r.disponibilidad.horaInicio < disp.horaFin
    );
    if (horarioSolapado) {
      throw new ConflictError(
        `Ese horario ya está reservado en la fecha ${
          res.fechaReservada.toISOString().split("T")[0]
        }`
      );
    }
  }

  /**
   * Lanza un error al intentar reservar en una fecha pasada (previa a la actual).
   * Pone la horaInicio de la disponibilidad como horario de la fechaReservada.
   */
  private validarFechaFutura(res: CrearReserva, disp: Disponibilidad) {
    const fechaReservada = toUTC(setHora(res.fechaReservada, disp.horaInicio));
    if (fechaReservada < new Date()) {
      throw new ConflictError("No se puede reservar una fecha pasada");
    }
  }

  /** Lanza un error al intentar reservar una disponibilidad en un día de la semana no habilitado. */
  private async validarDiaDeSemana(res: CrearReserva, disp: Disponibilidad) {
    const dia = getDiaDeSemana(res.fechaReservada);
    if (!disp.dias.includes(dia)) {
      throw new ConflictError(
        `La disponibilidad de ${disp.horaInicio} a ${disp.horaFin} solo está disponible los días ${disp.dias}`
      );
    }
  }
}
