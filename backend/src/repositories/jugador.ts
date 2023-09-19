import { PrismaClient } from "@prisma/client";
import { InternalServerError, NotFoundError } from "../utils/apierrors.js";
import { Jugador } from "../models/jugador.js";
import { toJugador } from "./auth.js";

export interface JugadorRepository {
  getJugadorByID(id: number): Promise<Jugador>;
  modificarJugador(jugador: Jugador): Promise<Jugador>;
}

export class PrismaJugadorRepository implements JugadorRepository {
  private prisma: PrismaClient;

  constructor(client: PrismaClient) {
    this.prisma = client;
  }

  async modificarJugador(jugador: Jugador) {
    try {
      const dbJugador = await this.prisma.jugador.update({
        where: { id: jugador.id },
        data: {
          nombre: jugador.nombre,
          apellido: jugador.apellido,
          correo: jugador.correo,
          telefono: jugador.telefono,
          usuario: jugador.usuario,
          localidad: {
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
          },
        },
      });

      return toJugador(dbJugador);
    } catch {
      throw new InternalServerError(
        "Error al intentar modificar los datos del jugador"
      );
    }
  }

  async getJugadorByID(id: number) {
    try {
      const dbJugador = await this.prisma.jugador.findUnique({
        where: { id },
        include: {
          disciplina: true, // Incluir información de disciplina
          localidad: true,   // Incluir información de localidad
        },
      });
      
      if (dbJugador) {
        return toJugador(dbJugador);
      }
    } catch {
      throw new InternalServerError("Error al buscar el jugador");
    }
    throw new NotFoundError("No existe jugador con id " + id);
  }
}
