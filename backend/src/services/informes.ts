import { Cancha } from "../models/cancha";
import { Establecimiento } from "../models/establecimiento";
import { Pago } from "../models/pago";
import { CanchaService } from "./canchas";
import { EstablecimientoService } from "./establecimientos";
import { PagoService } from "./pagos";

type PagosPorCancha = Establecimiento & {
  canchas: (Cancha & {
    pagos: Pago[];
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
  pagosPorCancha(query: PagosPorCanchaQuery): Promise<PagosPorCancha>;
}

export class InformeServiceImpl implements InformeService {
  estService: EstablecimientoService;
  pagoService: PagoService;
  canchaService: CanchaService;

  constructor(
    estService: EstablecimientoService,
    canchaService: CanchaService,
    pagoService: PagoService
  ) {
    this.estService = estService;
    this.pagoService = pagoService;
    this.canchaService = canchaService;
  }

  async pagosPorCancha(query: PagosPorCanchaQuery) {
    const est = await this.estService.getByID(query.idEst);
    const canchas = await this.canchaService.getByEstablecimientoID(est.id);
    const res: PagosPorCancha = { ...est, canchas: [], total: 0 };

    for (const c of canchas) {
      const pagos = await this.pagoService.buscar({
        idCancha: c.id,
        fechaDesde: query.fechaDesde,
        fechaHasta: query.fechaHasta,
      });

      const total = pagos.reduce((acum, p) => acum + p.monto.toNumber(), 0);
      res.canchas.push({ ...c, pagos, total });
    }

    res.total = res.canchas.reduce((acum, cancha) => acum + cancha.total, 0);
    return res;
  }
}
