import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/apierrors.js";
import { Result, err, ok } from "neverthrow";
import { Administrador } from "../models/administrador.js";

export interface AdministradorRepository {
  getAdministradorByID(id: number): Promise<Result<Administrador, ApiError>>;
}

export class PrismaAdministradorRepository implements AdministradorRepository {
  private prisma: PrismaClient;

  constructor(client: PrismaClient) {
    this.prisma = client;
  }

  async getAdministradorByID(
    id: number
  ): Promise<Result<Administrador, ApiError>> {
    try {
      const dbAdmin = await this.prisma.administrador.findUnique({
        where: {
          id: id,
        },
        include: {
          tarjeta: true,
          suscripcion: true,
        },
      });

      if (dbAdmin === null) {
        return err(new ApiError(404, "No existe administrador con id " + id));
      }

      return ok(dbAdmin);
    } catch (e) {
      console.error(e);
      return err(new ApiError(500, "No se pudo buscar el administrador"));
    }
  }
}
