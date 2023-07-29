import {
  PrismaClient,
  administrador,
  suscripcion,
  tarjeta,
} from "@prisma/client";
import { Administrador } from "../models/administrador.js";
import {
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/apierrors.js";
import { Rol } from "../services/auth.js";

export type AdministradorConClave = {
  admin: Administrador;
  clave: string;
};

export interface AuthRepository {
  crearAdministrador(
    admin: Administrador,
    clave: string
  ): Promise<Administrador>;
  getAdministradorYClave(
    correoOUsuario: string
  ): Promise<AdministradorConClave>;
  getRoles(correoOUsuario: string): Promise<Rol[]>;
}

export class PrismaAuthRepository implements AuthRepository {
  private prisma: PrismaClient;

  /**
   * Transforma objetos de Prisma (de la BBDD) a objetos del modelo del dominio.
   * Sirve para sacar la clave, que pasa desapercibida en el tipo `Administrador`.
   * @param admin una entidad administrador de Prisma.
   * @param suscripcion una entidad suscripcion de Prisma.
   * @param tarjeta una entidad tarjeta de Prisma.
   * @returns un objeto Administrador del dominio.
   */
  private toModel(
    { clave, idSuscripcion, idTarjeta, ...admin }: administrador,
    suscripcion: suscripcion,
    tarjeta: tarjeta
  ): Administrador {
    return { ...admin, suscripcion, tarjeta };
  }

  constructor(client: PrismaClient) {
    this.prisma = client;
  }

  async getAdministradorYClave(
    correoOUsuario: string
  ): Promise<AdministradorConClave> {
    try {
      const dbAdmin = await this.prisma.administrador.findFirstOrThrow({
        where: {
          OR: [{ correo: correoOUsuario }, { usuario: correoOUsuario }],
        },
        include: {
          suscripcion: true,
          tarjeta: true,
        },
      });
      return {
        admin: this.toModel(dbAdmin, dbAdmin.suscripcion, dbAdmin.tarjeta),
        clave: dbAdmin.clave,
      };
    } catch (e) {
      console.error(e);
      throw new NotFoundError(
        "No existe administrador con ese correo o usuario"
      );
    }
  }

  /**
   * Obtiene los roles de un usuario. Hasta ahora, cada usuario
   * tiene un solo rol, pero se retorna un arreglo de roles por las dudas.
   * @param correoOUsuario el correo/usuario guardado.
   * @returns los roles del usuario, o un `ApiError` si algo falla.
   */
  async getRoles(correoOUsuario: string): Promise<Rol[]> {
    try {
      const dbAdmin = await this.prisma.administrador.findFirst({
        where: {
          OR: [{ correo: correoOUsuario }, { usuario: correoOUsuario }],
        },
      });
      if (dbAdmin) {
        return [Rol.Administrador];
      }

      const dbJugador = await this.prisma.jugador.findFirst({
        where: {
          OR: [{ correo: correoOUsuario }, { usuario: correoOUsuario }],
        },
      });
      if (dbJugador) {
        return [Rol.Jugador];
      }
    } catch (e) {
      console.error(e);
      throw new InternalServerError("Error interno con la base de datos");
    }
    throw new UnauthorizedError("Correo o usuario incorrecto");
  }

  async crearAdministrador(
    admin: Administrador,
    clave: string
  ): Promise<Administrador> {
    try {
      const dbAdmin = await this.prisma.administrador.create({
        data: {
          nombre: admin.nombre,
          telefono: admin.telefono,
          apellido: admin.apellido,
          correo: admin.correo,
          clave: clave,
          usuario: admin.usuario,
          suscripcion: {
            connect: {
              id: admin.suscripcion.id,
            },
          },
          tarjeta: {
            create: { ...admin.tarjeta, id: undefined },
          },
        },
        include: {
          tarjeta: true,
          suscripcion: true,
        },
      });
      return this.toModel(dbAdmin, dbAdmin.suscripcion, dbAdmin.tarjeta);
    } catch (e) {
      console.error(e);
      throw new InternalServerError("No se pudo registrar al administrador");
    }
  }
}
