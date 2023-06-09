import {
  PrismaClient,
  administrador,
  suscripcion,
  tarjeta,
} from "@prisma/client";
import { Administrador } from "../models/administrador.js";
import { Result, err, ok } from "neverthrow";
import { ApiError } from "../utils/apierrors.js";

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
}

export class PrismaAuthRepository {
  prisma: PrismaClient;

  // Transforma objetos de Prisma de la base de datos a objetos del modelo del dominio.
  // Sirve para sacar la clave, que pasa desapercibida en el tipo Administrador.
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

  async crearAdministrador(
    admin: Administrador,
    clave: string
  ): Promise<Result<Administrador, ApiError>> {
    try {
      console.log(admin, clave);
      const dbAdmin = await this.prisma.administrador.create({
        data: {
          id: undefined,
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
