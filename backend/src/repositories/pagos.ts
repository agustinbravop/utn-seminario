import { PrismaClient, pago } from "@prisma/client";
import { MetodoDePago, Pago, PagoConReserva } from "../models/pago.js";
import Decimal from "decimal.js";
import { InternalServerError, NotFoundError } from "../utils/apierrors.js";
import { BuscarPagosQuery } from "../services/pagos.js";
import { ReservaDB, toResSinPagos } from "./reservas.js";

export interface PagoRepository {
  getByID(idPago: number): Promise<PagoConReserva>;
  buscar(filtros: BuscarPagosQuery): Promise<PagoConReserva[]>;
  crear(monto: Decimal, metodoPago: MetodoDePago): Promise<PagoConReserva>;
  getAll(): Promise<PagoConReserva[]>;
}

export class PrismaPagoRepository implements PagoRepository {
  private prisma: PrismaClient;
  private include = {
    reservas: {
      include: {
        jugador: {
          include: {
            localidad: true,
            disciplina: true,
          },
        },
        disponibilidad: {
          include: {
            disciplina: true,
            dias: true,
            cancha: {
              include: {
                establecimiento: true,
              },
            },
          },
        },
      },
    },
  };

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async getAll() {
    try {
      const pagos = await this.prisma.pago.findMany({ include: this.include });
      return pagos.map((p) => toPagoConReserva(p));
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
        include: this.include,
      });
      return pagos.map((p) => toPagoConReserva(p));
    } catch {
      throw new InternalServerError("Error interno al obtener los pagos");
    }
  }

  async getByID(id: number) {
    return awaitQuery(
      this.prisma.pago.findUnique({ where: { id }, include: this.include }),
      "Error al buscar el pago",
      "Error intero del servidor"
    );
  }

  async crear(monto: Decimal, metodoPago: string) {
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
        include: this.include,
      });
      return toPagoConReserva(pagoDB);
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

type PagoConReservaDB = PagoDB & {
  reservas: Omit<ReservaDB, "pagoReserva" | "pagoSenia">[];
};

export function toPagoConReserva(pago: PagoConReservaDB): PagoConReserva {
  return { ...toPago(pago), reserva: toResSinPagos(pago.reservas[0]) };
}

async function awaitQuery(
  promise: Promise<PagoConReservaDB | null>,
  notFoundMsg: string,
  errorMsg: string
): Promise<PagoConReserva> {
  try {
    const pagoDB = await promise;

    if (pagoDB) {
      return toPagoConReserva(pagoDB);
    }
  } catch {
    throw new InternalServerError(errorMsg);
  }
  throw new NotFoundError(notFoundMsg);
}
