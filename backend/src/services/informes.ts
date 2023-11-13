import { Cancha } from "../models/cancha.js";
import { Establecimiento } from "../models/establecimiento.js";
import { Reserva } from "../models/reserva.js";
import { setMidnight } from "../utils/dates.js";
import { CanchaService } from "./canchas.js";
import { EstablecimientoService } from "./establecimientos.js";
import { ReservaService } from "./reservas.js";

export type PagosPorCanchaQuery = {
  idEst: number;
  fechaDesde?: Date;
  fechaHasta?: Date;
};

type IngresosPorCancha = Establecimiento & {
  canchas: (Cancha & {
    reservas: Reserva[];
    estimado: number;
    total: number;
  })[];
  estimado: number;
  total: number;
};

export interface InformeService {
  ingresosPorCancha(query: PagosPorCanchaQuery): Promise<IngresosPorCancha>;
}

export class InformeServiceImpl implements InformeService {
  private estService: EstablecimientoService;
  private canchaService: CanchaService;
  private reservaService: ReservaService;

  constructor(
    estService: EstablecimientoService,
    canchaService: CanchaService,
    reservaService: ReservaService
  ) {
    this.estService = estService;
    this.canchaService = canchaService;
    this.reservaService = reservaService;
  }

  async ingresosPorCancha(query: PagosPorCanchaQuery) {
    const est = await this.estService.getByID(query.idEst);
    const canchas = await this.canchaService.getByEstablecimientoID(est.id);
    const res: IngresosPorCancha = {
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
}
