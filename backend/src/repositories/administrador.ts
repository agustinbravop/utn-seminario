import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/apierrors.js";
import { Administrador } from "../models/administrador.js";

export interface AdministradorRepository {
  getAdministradorByID(id: number): Promise<Administrador>;
}

export class PrismaAdministradorRepository implements AdministradorRepository {
  private prisma: PrismaClient;

  constructor(client: PrismaClient) {
    this.prisma = client;
  }

  async getAdministradorByID(id: number): Promise<Administrador> {
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
      if (dbAdmin) {
        return dbAdmin;
      }
    } catch (e) {
      console.error(e);
      throw new ApiError(500, "No se pudo buscar el administrador");
    }
    throw new ApiError(404, "No existe administrador con id " + id);
  }
}
