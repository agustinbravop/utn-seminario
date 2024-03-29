import { PrismaClient, disciplina, jugador, localidad } from "@prisma/client";
import { InternalServerError, NotFoundError } from "../utils/apierrors.js";
import { Jugador } from "../models/jugador.js";

type JugadorDB = jugador & {
  localidad: localidad | null;
  disciplina: disciplina | null;
};

/**
 * Sirve para sacar la clave, que pasa desapercibida en el tipo `Jugador`.
 * @param jugador una entidad jugador de Prisma.
 * @returns un objeto Jugador del dominio.
 */
export function toJugador({ clave, ...jugador }: JugadorDB): Jugador {
  return {
    ...jugador,
    telefono: jugador.telefono ?? undefined,
    disciplina: jugador.idDisciplina ?? undefined,
    localidad: jugador.localidad?.nombre ?? undefined,
    provincia: jugador.localidad?.idProvincia ?? undefined,
    password: clave !== null && clave !== "",
  };
}

export interface JugadorRepository {
  getJugadorByID(id: number): Promise<Jugador>;
  modificarJugador(jugador: Jugador): Promise<Jugador>;
  tieneClave(id: number): Promise<boolean>;
}

export class PrismaJugadorRepository implements JugadorRepository {
  private prisma: PrismaClient;
  private include = {
    localidad: true,
    disciplina: true,
  };

  constructor(client: PrismaClient) {
    this.prisma = client;
  }

  async modificarJugador(jugador: Jugador) {
    return awaitQuery(
      this.prisma.jugador.update({
        where: { id: jugador.id },
        data: {
          nombre: jugador.nombre,
          apellido: jugador.apellido,
          correo: jugador.correo,
          telefono: jugador.telefono,
          usuario: jugador.usuario,
          disciplina: jugador.disciplina
            ? {
                connectOrCreate: {
                  where: { disciplina: jugador.disciplina },
                  create: { disciplina: jugador.disciplina },
                },
              }
            : { disconnect: true },
          localidad:
            jugador.localidad || jugador.provincia
              ? {
                  connectOrCreate: {
                    where: {
                      nombre_idProvincia: {
                        nombre: jugador.localidad ?? "",
                        idProvincia: jugador.provincia ?? "",
                      },
                    },
                    create: {
                      nombre: jugador.localidad ?? "",
                      provincia: {
                        connectOrCreate: {
                          where: { provincia: jugador.provincia },
                          create: { provincia: jugador.provincia ?? "" },
                        },
                      },
                    },
                  },
                }
              : { disconnect: true },
        },
        include: this.include,
      }),
      `No se encuentra jugador con id ${jugador.id}`,
      "Error al intentar modificar los datos del jugador"
    );
  }

  async getJugadorByID(id: number) {
    return awaitQuery(
      this.prisma.jugador.findUnique({ where: { id }, include: this.include }),
      `No existe jugador con id ${id}`,
      "Error al buscar el jugador"
    );
  }

  async tieneClave(id: number) {
    let jugador = null;
    try {
      jugador = await this.prisma.jugador.findUnique({ where: { id } });
    } catch (e) {
      throw new InternalServerError(
        "Error al buscar al jugador en la base de datos"
      );
    }
    if (!jugador) {
      throw new NotFoundError(`No existe jugador con id ${id}`);
    }
    return jugador.clave !== null;
  }
}

async function awaitQuery(
  promise: Promise<JugadorDB | null>,
  notFoundMsg: string,
  errorMsg: string
): Promise<Jugador> {
  try {
    const jugadorDB = await promise;

    if (jugadorDB) {
      return toJugador(jugadorDB);
    }
  } catch {
    throw new InternalServerError(errorMsg);
  }

  throw new NotFoundError(notFoundMsg);
}
