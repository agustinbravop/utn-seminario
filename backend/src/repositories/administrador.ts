import { PrismaClient } from "@prisma/client";
import { InternalServerError, NotFoundError } from "../utils/apierrors.js";
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
          id: Number(id),
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
      throw new InternalServerError("No se pudo buscar el administrador");
    }
    throw new NotFoundError("No existe administrador con id " + id);
  }
}
