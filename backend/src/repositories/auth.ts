import { PrismaClient } from "@prisma/client";
import { Administrador } from "../models/administrador.js";
import {
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/apierrors.js";
import { Rol, Usuario, UsuarioConClave } from "../services/auth.js";
import { Jugador } from "../models/jugador.js";
import { toJugador } from "./jugador.js";
import { toAdmin } from "./administrador.js";

type AdministradorConClave = {
  admin: Administrador;
  clave: string;
  token?: string;
};

type JugadorConClave = { jugador: Jugador; clave: string; token?: string };

export interface AuthRepository {
  crearAdministrador(
    admin: Administrador,
    clave: string
  ): Promise<Administrador>;
  crearJugador(jugador: Jugador, clave?: string): Promise<Jugador>;
  getUsuarioYClave(correoOUsuario: string): Promise<UsuarioConClave>;
  getUsuario(correoOUsuario: string): Promise<Usuario>;
  getJugadorByID(id: number): Promise<Jugador>;
  getAdministradorByID(id: number): Promise<Administrador>;
  cambiarClave(correoOUsuario: string, clave: string): Promise<Usuario>;
  getRoles(correoOUsuario: string): Promise<Rol[]>;
}

export class PrismaAuthRepository implements AuthRepository {
  private prisma: PrismaClient;

  constructor(client: PrismaClient) {
    this.prisma = client;
  }

  async getAdministradorYClave(
    correoOUsuario: string
  ): Promise<AdministradorConClave> {
    try {
      const admin = await this.prisma.administrador.findFirstOrThrow({
        where: {
          OR: [{ correo: correoOUsuario }, { usuario: correoOUsuario }],
        },
        include: { suscripcion: true, tarjeta: true },
      });
      return {
        admin: toAdmin(admin),
        clave: admin.clave,
      };
    } catch (e) {
      throw new NotFoundError("No existe cuenta con ese correo o usuario");
    }
  }

  async getAdministrador(correoOUsuario: string) {
    try {
      const admin = await this.prisma.administrador.findFirstOrThrow({
        where: {
          OR: [{ correo: correoOUsuario }, { usuario: correoOUsuario }],
        },
        include: { suscripcion: true, tarjeta: true },
      });
      return toAdmin(admin);
    } catch (e) {
      throw new NotFoundError("No existe cuenta con ese correo o usuario");
    }
  }

  async getAdministradorByID(id: number) {
    try {
      const admin = await this.prisma.administrador.findFirstOrThrow({
        where: { id },
        include: { suscripcion: true, tarjeta: true },
      });
      return toAdmin(admin);
    } catch (e) {
      throw new NotFoundError("No existe cuenta con ese correo o usuario");
    }
  }

  async getJugadorYClave(correoOUsuario: string): Promise<JugadorConClave> {
    try {
      const jugador = await this.prisma.jugador.findFirstOrThrow({
        where: {
          OR: [{ correo: correoOUsuario }, { usuario: correoOUsuario }],
        },
        include: { disciplina: true, localidad: true },
      });
      return {
        jugador: toJugador(jugador),
        clave: jugador.clave as string,
      };
    } catch (e) {
      throw new NotFoundError("No existe cuenta con ese correo o usuario");
    }
  }

  async getJugador(correoOUsuario: string) {
    try {
      const jugador = await this.prisma.jugador.findFirstOrThrow({
        where: {
          OR: [{ correo: correoOUsuario }, { usuario: correoOUsuario }],
        },
        include: { disciplina: true, localidad: true },
      });
      return toJugador(jugador);
    } catch (e) {
      throw new NotFoundError("No existe cuenta con ese correo o usuario");
    }
  }

  async getJugadorByID(id: number) {
    try {
      const jugador = await this.prisma.jugador.findFirstOrThrow({
        where: { id },
        include: { disciplina: true, localidad: true },
      });
      return toJugador(jugador);
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
   * Primero busca un jugador. Si no lo encuentra, busca un administrador.
   * Si tampoco encuentra un administrador, tira un error 404.
   * @param correoOUsuario del usuario a buscar
   */
  async getUsuario(correoOUsuario: string): Promise<Usuario> {
    try {
      return { admin: await this.getAdministrador(correoOUsuario) };
    } catch {
      return { jugador: await this.getJugador(correoOUsuario) };
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

  async crearJugador(jug: Jugador, clave?: string) {
    try {
      const dbJugador = await this.prisma.jugador.create({
        data: {
          nombre: jug.nombre,
          telefono: jug.telefono,
          apellido: jug.apellido,
          correo: jug.correo,
          usuario: jug.usuario,
          clave: clave,
          disciplina: jug.disciplina
            ? {
                connectOrCreate: {
                  where: { disciplina: jug.disciplina },
                  create: { disciplina: jug.disciplina },
                },
              }
            : {},
          localidad:
            jug.provincia || jug.localidad
              ? {
                  connectOrCreate: {
                    where: {
                      nombre_idProvincia: {
                        nombre: jug.localidad ?? "",
                        idProvincia: jug.provincia ?? "",
                      },
                    },
                    create: {
                      nombre: jug.localidad ?? "",
                      provincia: {
                        connectOrCreate: {
                          where: { provincia: jug.provincia },
                          create: { provincia: jug.provincia ?? "" },
                        },
                      },
                    },
                  },
                }
              : {},
        },
        include: { disciplina: true, localidad: true },
      });
      return toJugador(dbJugador);
    } catch (e) {
      console.error(e);
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
      return toJugador(dbJugador);
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
      return toAdmin(dbAdmin);
    } catch (e) {
      throw new InternalServerError("No se pudo cambiar la contraseña");
    }
  }

  async cambiarClave(correoOUsuario: string, clave: string) {
    const roles = await this.getRoles(correoOUsuario);
    if (roles.includes(Rol.Administrador)) {
      const a = await this.cambiarClaveAdministrador(correoOUsuario, clave);
      return { admin: a };
    } else {
      const j = await this.cambiarClaveJugador(correoOUsuario, clave);
      return { jugador: j };
    }
  }
}
