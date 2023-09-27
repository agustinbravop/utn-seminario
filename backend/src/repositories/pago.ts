import { PrismaClient } from "@prisma/client";
import { Pago } from "../models/pago";
import Decimal from "decimal.js";
import { InternalServerError } from "../utils/apierrors";

export interface PagoRepository {
  crearPago(monto: Decimal, metodoPago: string, fecha: Date): Promise<Pago>;
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

  async crearPago(
    monto: Decimal,
    metodoPago: string,
    fecha: Date
  ): Promise<Pago> {
    try {
      const pagoDB = await this.prisma.pago.create({
        data: {
          id: undefined,
          fechaPago: fecha,
          monto: monto,
          metodoDePago: { connect: { metodoDePago: metodoPago } },
        },
      });

      return pagoDB;
    } catch {
      throw new InternalServerError("Error al crear el pago");
    }
  }
}
