import { PrismaClient, suscripcion } from "@prisma/client";
import { InternalServerError, NotFoundError } from "../utils/apierrors.js";
import { Suscripcion } from "../models/suscripcion.js";

export interface SuscripcionRepository {
  getSuscripcionByID(id: number): Promise<Suscripcion>;
  getAllSuscripciones(): Promise<Suscripcion[]>;
}

export class PrismaSuscripcionRepository implements SuscripcionRepository {
  private prisma: PrismaClient;

  constructor(client: PrismaClient) {
    this.prisma = client;
  }

  async getSuscripcionByID(id: number) {
    try {
      const suscripcion = await this.prisma.suscripcion.findUnique({
        where: {
          id: id,
        },
      });
      if (suscripcion) {
        return toSuscripcion(suscripcion);
      }
    } catch (e) {
      throw new InternalServerError("Error al buscar la suscripcion");
    }
    throw new NotFoundError("No existe suscripcion con ese id");
  }

  async getAllSuscripciones() {
    try {
      const suscripciones = await this.prisma.suscripcion.findMany();
      return suscripciones.map((s) => toSuscripcion(s));
    } catch (e) {
      throw new InternalServerError("No se pudo obtener las suscripciones");
    }
  }
}

export type suscripcionDB = suscripcion;

export function toSuscripcion(suscripcion: suscripcionDB): Suscripcion {
  return { ...suscripcion, costoMensual: suscripcion.costoMensual.toNumber() };
}
