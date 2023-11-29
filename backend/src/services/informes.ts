import { Cancha } from "../models/cancha.js";
import { Establecimiento } from "../models/establecimiento.js";
import { Reserva } from "../models/reserva.js";
import { setMidnight } from "../utils/dates.js";
import { CanchaService } from "./canchas.js";
import { EstablecimientoService } from "./establecimientos.js";
import { ReservaService } from "./reservas.js";
import {
  InformeRepository,
  HorariosPorSemana,
} from "../repositories/informe.js";
import { Pago } from "../models/pago.js";
import { PagoService } from "./pagos.js";

export type HorariosPopularesQuery = {
  idEst: number;
  horaInicio: string;
  horaFinal: string;
};

export type ReservasPorCanchaQuery = {
  idEst: number;
  fechaDesde?: Date;
  fechaHasta?: Date;
};

type ReservasPorCancha = Establecimiento & {
  canchas: (Cancha & {
    reservas: Reserva[];
    estimado: number;
    total: number;
  })[];
  estimado: number;
  total: number;
};

export type PagosPorCanchaQuery = {
  idEst: number;
  fechaDesde?: Date;
  fechaHasta?: Date;
};

type PagosPorCancha = Establecimiento & {
  canchas: (Cancha & {
    pagos: Pago[];
    total: number;
  })[];
  total: number;
};

export interface InformeService {
  reservasPorCancha(query: ReservasPorCanchaQuery): Promise<ReservasPorCancha>;
  pagosPorCancha(query: PagosPorCanchaQuery): Promise<PagosPorCancha>;
  horariosPopulares(query: HorariosPopularesQuery): Promise<HorariosPorSemana>;
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
    const res: ReservasPorCancha = {
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
      });

      const estimado = reservas.reduce((acum, r) => {
        return acum + r.precio;
      }, 0);

      const total = reservas.reduce((acum, r) => {
        const senia = r.pagoSenia?.monto ?? 0;
        const monto = r.pagoReserva?.monto ?? 0;
        return acum + senia + monto;
      }, 0);

      res.canchas.push({ ...c, reservas, total, estimado });
      res.total += total;
      res.estimado += estimado;
    }

    return res;
  }

  async pagosPorCancha(query: PagosPorCanchaQuery) {
    const est = await this.estService.getByID(query.idEst);
    const canchas = await this.canchaService.getByEstablecimientoID(est.id);
    const res: PagosPorCancha = {
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

      const total = pagos.reduce((acum, p) => {
        const senia = p.monto ?? 0;
        const monto = p.monto ?? 0;
        return acum + senia + monto;
      }, 0);

      res.canchas.push({ ...c, pagos, total });
      res.total += total;
    }

    return res;
  }

  async horariosPopulares(
    query: HorariosPopularesQuery
  ): Promise<HorariosPorSemana> {
    return await this.informe.getAllReserva(query);
  }
}
