import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/apierrors.js";
import { Result, err, ok } from "neverthrow";
import { Suscripcion } from "../models/suscripcion.js";

export interface SuscripcionRepository {
  getSuscripcionByID(id: number): Promise<Result<Suscripcion, ApiError>>;
  getAllSuscripciones(): Promise<Result<Suscripcion[], ApiError>>;
}

export class PrismaSuscripcionRepository {
  private prisma: PrismaClient;

  constructor(client: PrismaClient) {
    this.prisma = client;
  }

  async getSuscripcionByID(id: number): Promise<Result<Suscripcion, ApiError>> {
    try {
      const suscripcion: Suscripcion =
        await this.prisma.suscripcion.findUniqueOrThrow({
          where: {
            id: id,
          },
        });
      return ok(suscripcion);
    } catch (e) {
      return err(new ApiError(404, "No existe suscripcion con ese id"));
    }
  }

  async getAllSuscripciones(): Promise<Result<Suscripcion[], ApiError>> {
    try {
      const suscripciones = await this.prisma.suscripcion.findMany();
      return ok(suscripciones);
    } catch (e) {
      return err(new ApiError(500, "No se pudo obtener las suscripciones"));
    }
  }
}
