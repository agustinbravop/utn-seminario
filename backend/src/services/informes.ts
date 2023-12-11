import { Cancha } from "../models/cancha.js";
import { Establecimiento } from "../models/establecimiento.js";
import { Reserva } from "../models/reserva.js";
import { setMidnight } from "../utils/dates.js";
import { CanchaService } from "./canchas.js";
import { EstablecimientoService } from "./establecimientos.js";
import { ReservaService } from "./reservas.js";
import { InformeRepository } from "../repositories/informes.js";
import { PagoService } from "./pagos.js";
import { PagoConReserva } from "../models/pago.js";
import { Dia } from "../models/disponibilidad.js";

export type DiasDeSemanaPopularesQuery = {
  idEst: number;
  horaInicio: string;
  horaFin: string;
};

export type ReservasPorCanchaQuery = {
  idEst: number;
  fechaDesde?: Date;
  fechaHasta?: Date;
};

export type ReservasPorCancha = Establecimiento & {
  canchas: (Cancha & {
    reservas: Reserva[];
    estimado: number;
    total: number;
  })[];
  estimado: number;
  total: number;
};

export type PagosPorCancha = Establecimiento & {
  canchas: (Cancha & {
    pagos: PagoConReserva[];
    total: number;
  })[];
  total: number;
};

export interface InformeService {
  /** Cuenta las reservas realizadas con un corte de control por cancha. */
  reservasPorCancha(query: ReservasPorCanchaQuery): Promise<ReservasPorCancha>;
  /** Cuenta los pagos realizados con un corte de control por cancha. */
  pagosPorCancha(query: ReservasPorCanchaQuery): Promise<PagosPorCancha>;
  /**
   * Devuelve un arreglo de pares `dia: cantidad` donde para cada día de la semana
   * indica la cantidad de reservas jugadas (y por jugar) en ese día.
   */
  diasDeSemanaPopulares(
    query: DiasDeSemanaPopularesQuery
  ): Promise<Record<Dia, number>>;
  /**
   * Devuelve un arreglo de pares `horario: cantidad` donde para cada horario (todos de
   * 00:00 a 23:55) indica la cantidad de reservas jugadas (y por jugar) en ese horario.
   */
  horariosPopulares(
    query: DiasDeSemanaPopularesQuery
  ): Promise<Record<string, number>>;
}

export class InformeServiceImpl implements InformeService {
  private estService: EstablecimientoService;
  private canchaService: CanchaService;
  private reservaService: ReservaService;
  private pagoService: PagoService;
  private informe: InformeRepository;

  constructor(
    estService: EstablecimientoService,
    canchaService: CanchaService,
    reservaService: ReservaService,
    pagoService: PagoService,
    informeService: InformeRepository
  ) {
    this.estService = estService;
    this.canchaService = canchaService;
    this.reservaService = reservaService;
    this.pagoService = pagoService;
    this.informe = informeService;
  }

  async reservasPorCancha(query: ReservasPorCanchaQuery) {
    const est = await this.estService.getByID(query.idEst);
    const canchas = await this.canchaService.getByEstablecimientoID(est.id);
    const reservasPorCancha: ReservasPorCancha = {
      ...est,
      canchas: [],
      total: 0,
      estimado: 0,
    };

    for (const c of canchas) {
      let reservas = await this.reservaService.buscar({
        idCancha: c.id,
        fechaReservadaDesde: query.fechaDesde,
        fechaReservadaHasta: query.fechaHasta
          ? setMidnight(query.fechaHasta)
          : undefined,
        cancelada: false,
      });

      const estimado = reservas.reduce((acum, r) => {
        return acum + r.precio;
      }, 0);

      const total = reservas.reduce((acum, r) => {
        const senia = r.pagoSenia?.monto ?? 0;
        const monto = r.pagoReserva?.monto ?? 0;
        return acum + senia + monto;
      }, 0);

      reservasPorCancha.canchas.push({ ...c, reservas, total, estimado });
      reservasPorCancha.total += total;
      reservasPorCancha.estimado += estimado;
    }

    return reservasPorCancha;
  }

  async pagosPorCancha(query: ReservasPorCanchaQuery) {
    const est = await this.estService.getByID(query.idEst);
    const canchas = await this.canchaService.getByEstablecimientoID(est.id);
    const pagosPorCancha: PagosPorCancha = {
      ...est,
      canchas: [],
      total: 0,
    };

    for (const c of canchas) {
      let pagos = await this.pagoService.buscar({
        idCancha: c.id,
        fechaDesde: query.fechaDesde,
        fechaHasta: query.fechaHasta
          ? setMidnight(query.fechaHasta)
          : undefined,
      });

      const total = pagos.reduce((acum, p) => acum + p.monto ?? 0, 0);

      pagosPorCancha.canchas.push({ ...c, pagos, total });
      pagosPorCancha.total += total;
    }

    return pagosPorCancha;
  }

  async diasDeSemanaPopulares(query: DiasDeSemanaPopularesQuery) {
    return await this.informe.getDiasDeSemanaPopulares(query);
  }

  async horariosPopulares(query: DiasDeSemanaPopularesQuery) {
    return await this.informe.getHorariosPopulares(query);
  }
}
