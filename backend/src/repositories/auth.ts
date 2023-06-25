import {
  PrismaClient,
  administrador,
  suscripcion,
  tarjeta,
} from "@prisma/client";
import { Administrador } from "../models/administrador.js";
import { Result, err, ok } from "neverthrow";
import { ApiError } from "../utils/apierrors.js";
import { Rol } from "../services/auth.js";

export type AdministradorConClave = {
  admin: Administrador;
  clave: string;
};

export interface AuthRepository {
  crearAdministrador(
    admin: Administrador,
    clave: string
  ): Promise<Result<Administrador, ApiError>>;
  getAdministradorYClave(
    correoOUsuario: string
  ): Promise<Result<AdministradorConClave, ApiError>>;
  getRoles(correoOUsuario: string): Promise<Result<Rol[], ApiError>>;
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
  ): Promise<Result<AdministradorConClave, ApiError>> {
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
      return ok({
        admin: this.toModel(dbAdmin, dbAdmin.suscripcion, dbAdmin.tarjeta),
        clave: dbAdmin.clave,
      });
    } catch (e) {
      return err(
        new ApiError(404, "No existe administrador con ese correo o usuario")
      );
    }
  }

  /**
   * Obtiene los roles de un usuario. Hasta ahora, cada usuario
   * tiene un solo rol, pero se retorna un arreglo de roles por las dudas.
   * @param correoOUsuario el correo/usuario guardado.
   * @returns los roles del usuario, o un `ApiError` si algo falla.
   */
  async getRoles(correoOUsuario: string): Promise<Result<Rol[], ApiError>> {
    try {
      const dbAdmin = await this.prisma.administrador.findFirst({
        where: {
          OR: [{ correo: correoOUsuario }, { usuario: correoOUsuario }],
        },
      });
      if (dbAdmin) {
        return ok([Rol.Administrador]);
      }

      const dbJugador = await this.prisma.jugador.findFirst({
        where: {
          OR: [{ correo: correoOUsuario }, { usuario: correoOUsuario }],
        },
      });
      if (dbJugador) {
        return ok([Rol.Jugador]);
      }

      return err(new ApiError(401, "Correo o usuario incorrecto"));
    } catch (e) {
      return err(new ApiError(500, "Error interno con la base de datos"));
    }
  }

  async crearAdministrador(
    admin: Administrador,
    clave: string
  ): Promise<Result<Administrador, ApiError>> {
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
            create: admin.tarjeta,
          },
        },
        include: {
          tarjeta: true,
          suscripcion: true,
        },
      });
      return ok(this.toModel(dbAdmin, dbAdmin.suscripcion, dbAdmin.tarjeta));
    } catch (e) {
      return err(new ApiError(500, "No se pudo registrar al administrador"));
    }
  }
}
