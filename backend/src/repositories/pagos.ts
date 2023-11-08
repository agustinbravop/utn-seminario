import { PrismaClient, pago } from "@prisma/client";
import { MetodoDePago, Pago } from "../models/pago";
import Decimal from "decimal.js";
import { InternalServerError, NotFoundError } from "../utils/apierrors";
import { BuscarPagosQuery } from "../services/pagos";

export interface PagoRepository {
  getByID(idPago: number): Promise<Pago>;
  buscar(filtros: BuscarPagosQuery): Promise<Pago[]>;
  crear(monto: Decimal, metodoPago: MetodoDePago): Promise<Pago>;
  getAll(): Promise<Pago[]>;
}

export class PrismaPagoRepository implements PagoRepository {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async getAll(): Promise<Pago[]> {
    try {
      const pagos = await this.prisma.pago.findMany();
      return pagos.map((p) => toPago(p));
    } catch (e) {
      throw new InternalServerError("Error interno al obtener los pagos");
    }
  }

  async buscar(filtros: BuscarPagosQuery) {
    try {
      const pagos = await this.prisma.pago.findMany({
        where: {
          fechaPago: {
            gte: filtros.fechaDesde,
            lte: filtros.fechaHasta,
          },
          reservas: {
            some: {
              disponibilidad: {
                cancha: {
                  id: filtros.idCancha,
                  idEstablecimiento: filtros.idEst,
                },
              },
            },
          },
        },
      });
      return pagos.map((p) => toPago(p));
    } catch {
      throw new InternalServerError("Error interno al obtener los pagos");
    }
  }

  async getByID(id: number) {
    return awaitQuery(
      this.prisma.pago.findUnique({ where: { id } }),
      "Error al buscar el pago",
      "Error intero del servidor"
    );
  }

  async crear(monto: Decimal, metodoPago: string): Promise<Pago> {
    try {
      const fecha = new Date();
      const pagoDB = await this.prisma.pago.create({
        data: {
          fechaPago: fecha,
          monto: monto,
          metodoDePago: {
            connectOrCreate: {
              where: { metodoDePago: metodoPago },
              create: { metodoDePago: metodoPago },
            },
          },
        },
      });
      return toPago(pagoDB);
    } catch {
      throw new InternalServerError("Error al crear el pago");
    }
  }
}

type PagoDB = pago;

export function toPago(pago: PagoDB): Pago {
  return {
    ...pago,
    monto: pago.monto.toNumber(),
    metodoDePago: pago.idMetodoDePago as MetodoDePago,
  };
}

async function awaitQuery(
  promise: Promise<PagoDB | null>,
  notFoundMsg: string,
  errorMsg: string
): Promise<Pago> {
  try {
    const pagoDB = await promise;

    if (pagoDB) {
      return toPago(pagoDB);
    }
  } catch {
    throw new InternalServerError(errorMsg);
  }
  throw new NotFoundError(notFoundMsg);
}
