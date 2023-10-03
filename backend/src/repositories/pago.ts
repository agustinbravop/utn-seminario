import { Prisma, PrismaClient } from "@prisma/client";
import { Pago } from "../models/pago";
import Decimal from "decimal.js";
import { InternalServerError } from "../utils/apierrors";

export interface PagoRepository {
  getPagoById(pagoSenia: number): unknown;
  crearPago(monto: Decimal, metodoPago: string): Promise<Pago>;
  getPagosAll(): Promise<Pago[]>;
}

export class PrismaPagoRepository implements PagoRepository {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  //Para testear nomas
  async getPagosAll(): Promise<Pago[]> {
    try {
      return await this.prisma.pago.findMany();
    } catch (e) {
      throw new InternalServerError("Error al obtener los pagos");
    }
  }

  async getPagoById(id: number): Promise<Pago | null> {
    try {
      const newPago = await this.prisma.pago.findUnique({
        where: { id },
      });

      if (newPago === null) {
        return null;
      }

      return newPago;
    } catch (e) {
      throw new InternalServerError("Error al obtener el pago");
    }
  }

  async crearPago(monto: Decimal, metodoPago: string): Promise<Pago> {
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
      return pagoDB;
    } catch {
      throw new InternalServerError("Error al crear el pago");
    }
  }
}
