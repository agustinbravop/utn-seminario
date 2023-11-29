import {
  PrismaClient,
  administrador,
  suscripcion,
  tarjeta,
} from "@prisma/client";
import { InternalServerError, NotFoundError } from "../utils/apierrors.js";
import { Administrador } from "../models/administrador.js";
import { toSuscripcion } from "./suscripciones.js";

export interface AdministradorRepository {
  getAdministradorByID(id: number): Promise<Administrador>;
  modificarAdministrador(admin: Administrador): Promise<Administrador>;
}

export class PrismaAdministradorRepository implements AdministradorRepository {
  private prisma: PrismaClient;

  constructor(client: PrismaClient) {
    this.prisma = client;
  }

  async modificarAdministrador(admin: Administrador): Promise<Administrador> {
    try {
      const dbAdmin = await this.prisma.administrador.update({
        where: { id: admin.id },
        data: {
          nombre: admin.nombre,
          apellido: admin.apellido,
          correo: admin.correo,
          telefono: admin.telefono,
          usuario: admin.usuario,
          idSuscripcion: admin.suscripcion.id,
        },
        include: {
          tarjeta: true,
          suscripcion: true,
        },
      });
      return toAdmin(dbAdmin);
    } catch {
      throw new InternalServerError(
        "Error interno al intentar modificar los datos del administrador"
      );
    }
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
        return toAdmin(dbAdmin);
      }
    } catch {
      throw new InternalServerError("Error al buscar el administrador");
    }
    throw new NotFoundError("No existe administrador con id " + id);
  }
}

type AdministradorDB = administrador & {
  suscripcion: suscripcion;
  tarjeta: tarjeta;
};

/**
 * Sirve para sacar la clave, que pasa desapercibida en el tipo `Administrador`.
 * @param admin una entidad administrador de Prisma.
 * @param suscripcion una entidad suscripcion de Prisma.
 * @param tarjeta una entidad tarjeta de Prisma.
 * @returns un objeto Administrador del dominio.
 */
export function toAdmin({
  clave,
  idSuscripcion,
  idTarjeta,
  ...admin
}: AdministradorDB): Administrador {
  return { ...admin, suscripcion: toSuscripcion(admin.suscripcion) };
}
