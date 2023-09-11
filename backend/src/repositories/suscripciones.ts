import { PrismaClient } from "@prisma/client";
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

  async getSuscripcionByID(id: number): Promise<Suscripcion> {
    try {
      const suscripcion = await this.prisma.suscripcion.findUnique({
        where: {
          id: id,
        },
      });
      if (suscripcion) {
        return suscripcion;
      }
    } catch (e) {
      throw new InternalServerError("Error al buscar la suscripcion");
    }
    throw new NotFoundError("No existe suscripcion con ese id");
  }

  async getAllSuscripciones(): Promise<Suscripcion[]> {
    try {
      const suscripciones = await this.prisma.suscripcion.findMany();
      return suscripciones;
    } catch (e) {
      throw new InternalServerError("No se pudo obtener las suscripciones");
    }
  }
}
