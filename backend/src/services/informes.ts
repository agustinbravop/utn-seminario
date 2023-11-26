import { Cancha } from "../models/cancha";
import { Establecimiento } from "../models/establecimiento";
import { Reserva } from "../models/reserva";
import { setMidnight } from "../utils/dates";
import { CanchaService } from "./canchas";
import { EstablecimientoService } from "./establecimientos";
import { ReservaService } from "./reservas";
import { InformeRepository, Semanas} from "../repositories/informe";

export type queryHorarios = { 
  idEst:number; 
  horaInicio:string;  
  horaFinal:string; 
}
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
  getAllReserva(queryHorarios:queryHorarios):Promise<Semanas>; 
}

export class InformeServiceImpl implements InformeService {
  private estService: EstablecimientoService;
  private canchaService: CanchaService;
  private reservaService: ReservaService;
  private informe:InformeRepository;  

  constructor(
    estService: EstablecimientoService,
    canchaService: CanchaService,
    reservaService: ReservaService, 
    informeService:InformeRepository,
  ) {
    this.estService = estService;
    this.canchaService = canchaService;
    this.reservaService = reservaService;
    this.informe=informeService; 
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

  async getAllReserva(query:queryHorarios):Promise<Semanas> 
  { 
    return await this.informe.getAllReserva(query); 
  }
}
