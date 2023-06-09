import { PrismaClient } from "@prisma/client";
import { Administrador } from "../models/administrador";
import { Result, err, ok } from "neverthrow";
import { ApiError } from "../utils/apierrors";

export type AdministradorConClave = {
  admin: Administrador;
  clave: string;
};

export interface AuthRepository {
  crearAdministrador(
    admin: Administrador,
    clave: string
  ): Promise<Result<Administrador, ApiError>>;
  getAdministradorByCorreoOUsuario(
    correoOUsuario: string
  ): Promise<Result<AdministradorConClave, ApiError>>;
}

export class PrismaAuthRepository {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAdministradorByCorreoOUsuario(
    correoOUsuario: string
  ): Promise<Result<AdministradorConClave, ApiError>> {
    try {
      const admin = await this.prisma.administrador.findFirstOrThrow({
        where: {
          OR: [{ correo: correoOUsuario }, { usuario: correoOUsuario }],
        },
      });
      return ok({ admin, clave: admin.clave });
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
      const adminCreado: Administrador = await this.prisma.administrador.create(
        { data: admin }
      );
      return ok(adminCreado);
    } catch (e) {
      return err(new ApiError(500, "No se pudo registrar"));
    }
  }
}
