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
import { Rol, Usuario } from "../services/auth.js";
import { Jugador } from "../models/jugador.js";
import { toJugador } from "./jugador.js";

export type AdministradorConClave = {
  admin: Administrador;
  clave: string;
};

export type UsuarioConClave = Usuario & { clave: string };

export type JugadorConClave = {
  jugador: Jugador;
  clave: string;
};

export interface AuthRepository {
  crearAdministrador(
    admin: Administrador,
    clave: string
  ): Promise<Administrador>;
  crearJugador(jugador: Jugador, clave: string): Promise<Jugador>;
  getUsuarioYClave(correoOUsuario: string): Promise<UsuarioConClave>;
  cambiarClave(correoOUsuario: string, clave: string): Promise<UsuarioConClave>;
  getRoles(correoOUsuario: string): Promise<Rol[]>;
}

export class PrismaAuthRepository implements AuthRepository {
  private prisma: PrismaClient;

  constructor(client: PrismaClient) {
    this.prisma = client;
  }

  async getAdministradorYClave(correoOUsuario: string) {
    try {
      const a = await this.prisma.administrador.findFirstOrThrow({
        where: {
          OR: [{ correo: correoOUsuario }, { usuario: correoOUsuario }],
        },
        include: { suscripcion: true, tarjeta: true },
      });
      return { admin: toAdmin(a), clave: a.clave };
    } catch (e) {
      throw new NotFoundError("No existe cuenta con ese correo o usuario");
    }
  }

  async getJugadorYClave(correoOUsuario: string) {
    try {
      console.log(correoOUsuario)
      const j = await this.prisma.jugador.findFirstOrThrow({
        where: {
          OR: [{ correo: correoOUsuario }, { usuario: correoOUsuario }],
        },
        include: { disciplina: true, localidad: true },
      });
      return { jugador: toJugador(j), clave: j.clave };
    } catch (e) {
      throw new NotFoundError("No existe cuenta con ese correo o usuario");
    }
  }

  /**
   * Primero busca un jugador. Si no lo encuentra, busca un administrador.
   * Si tampoco encuentra un administrador, tira un error 404.
   * @param correoOUsuario del usuario a buscar
   */
  async getUsuarioYClave(correoOUsuario: string): Promise<UsuarioConClave> {
    try {
      return await this.getAdministradorYClave(correoOUsuario);
    } catch {
      return await this.getJugadorYClave(correoOUsuario);
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
      throw new InternalServerError("Error interno con la base de datos");
    }
    throw new UnauthorizedError("Correo o usuario incorrecto");
  }

  async crearAdministrador(admin: Administrador, clave: string) {
    try {
      const dbAdmin = await this.prisma.administrador.create({
        data: {
          nombre: admin.nombre,
          telefono: admin.telefono,
          apellido: admin.apellido,
          correo: admin.correo,
          clave: clave,
          usuario: admin.usuario,
          suscripcion: { connect: { id: admin.suscripcion.id } },
          tarjeta: { create: { ...admin.tarjeta, id: undefined } },
        },
        include: { tarjeta: true, suscripcion: true },
      });
      return toAdmin(dbAdmin);
    } catch (e) {
      throw new InternalServerError("No se pudo registrar al administrador");
    }
  }

  async crearJugador(jugador: Jugador, clave: string) {
    try {
      const dbJugador = await this.prisma.jugador.create({
        data: {
          nombre: jugador.nombre,
          telefono: jugador.telefono,
          apellido: jugador.apellido,
          correo: jugador.correo,
          usuario: jugador.usuario,
          clave: clave,
          disciplina: jugador.disciplina
            ? {
                connectOrCreate: {
                  where: { disciplina: jugador.disciplina },
                  create: { disciplina: jugador.disciplina },
                },
              }
            : {},
          localidad: {
            connectOrCreate: {
              where: {
                nombre_idProvincia: {
                  nombre: jugador.localidad ?? " ",
                  idProvincia: jugador.provincia ?? " ",
                },
              },
              create: {
                nombre: jugador.localidad ?? " ",
                provincia: {
                  connectOrCreate: {
                    where: { provincia: jugador.provincia ?? " " },
                    create: { provincia: jugador.provincia ?? " " },
                  },
                },
              },
            },
          },
        },
        include: { disciplina: true, localidad: true },
      });
      return toJugador(dbJugador);
    } catch (e) {
      throw new InternalServerError("No se pudo registrar al jugador");
    }
  }

  private async cambiarClaveJugador(correoOUsuario: string, clave: string) {
    const { jugador } = await this.getJugadorYClave(correoOUsuario);
    try {
      const dbJugador = await this.prisma.jugador.update({
        where: { id: jugador.id },
        data: { clave },
        include: { disciplina: true, localidad: true },
      });
      return dbJugador;
    } catch (e) {
      throw new InternalServerError("No se pudo cambiar la contraseña");
    }
  }

  private async cambiarClaveAdministrador(
    correoOUsuario: string,
    clave: string
  ) {
    const { admin } = await this.getAdministradorYClave(correoOUsuario);
    try {
      const dbAdmin = await this.prisma.administrador.update({
        where: { id: admin.id },
        data: { clave },
        include: { tarjeta: true, suscripcion: true },
      });
      return dbAdmin;
    } catch (e) {
      throw new InternalServerError("No se pudo cambiar la contraseña");
    }
  }
  async cambiarClave(correoOUsuario: string, clave: string) {
    const roles = await this.getRoles(correoOUsuario);
    if (roles.includes(Rol.Administrador)) {
      const a = await this.cambiarClaveAdministrador(correoOUsuario, clave);
      return { admin: toAdmin(a), clave: a.clave };
    } else {
      const j = await this.cambiarClaveJugador(correoOUsuario, clave);
      return { jugador: toJugador(j), clave: j.clave };
    }
  }
}

type administradorDB = administrador & {
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
}: administradorDB): Administrador {
  return admin;
}
