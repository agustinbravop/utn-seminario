import { PrismaClient } from "@prisma/client";
import { InternalServerError, NotFoundError } from "../utils/apierrors.js";
import { Administrador } from "../models/administrador.js";

export interface AdministradorRepository {
  getAdministradorByID(id: number): Promise<Administrador>;
  modificarAdmin(admin: Administrador):  Promise<Administrador>;
}

export class PrismaAdministradorRepository implements AdministradorRepository {
  private prisma: PrismaClient;

  constructor(client: PrismaClient) {
    this.prisma = client;
  }

  async modificarAdmin(admin: Administrador): Promise<Administrador> {
    try{
      const { id } = await this.prisma.administrador.update({
        where: {id: admin.id },
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
        }
      });
      return await this.getAdministradorByID(id);
    }
    catch(e){
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
        return dbAdmin;
      }
    } catch (e) {
      console.error(e);
      throw new InternalServerError("No se pudo buscar el administrador");
    }
    throw new NotFoundError("No existe administrador con id " + id);
  }
}
