import { Cancha } from "../models/cancha";
import { Establecimiento } from "../models/establecimiento";
import { Reserva } from "../models/reserva";
import { CanchaService } from "./canchas";
import { EstablecimientoService } from "./establecimientos";
import { ReservaService } from "./reservas";

type IngresosPorCancha = Establecimiento & {
  canchas: (Cancha & {
    reservas: Reserva[];
    total: number;
  })[];
  total: number;
};

export type PagosPorCanchaQuery = {
  idEst: number;
  fechaDesde?: string;
  fechaHasta?: string;
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
    const res: IngresosPorCancha = { ...est, canchas: [], total: 0 };

    for (const c of canchas) {
      let reservas = await this.reservaService.buscar({
        idCancha: c.id,
        fechaCreadaDesde: query.fechaDesde,
        fechaCreadaHasta: query.fechaHasta,
      });

      const total = reservas.reduce((acum, r) => {
        const senia = r.pagoSenia?.monto.toNumber() ?? 0;
        const monto = r.pagoReserva?.monto.toNumber() ?? 0;
        return acum + senia + monto;
      }, 0);
      res.canchas.push({ ...c, reservas, total });
    }

    res.total = res.canchas.reduce((acum, cancha) => acum + cancha.total, 0);
    return res;
  }
}
