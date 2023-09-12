import { Reserva } from "../models/reserva.js";
import { InternalServerError, NotFoundError } from "../utils/apierrors.js";
import { PrismaClient, jugador, reserva } from "@prisma/client";
import { disponibilidadDB, toDisp } from "./disponibilidades.js";
import { CrearReserva } from "../services/reservas.js";
import Decimal from "decimal.js";

export interface ReservaRepository {
  getReservasByEstablecimientoID(idEst: number): Promise<Reserva[]>;
  getReservasByDisponibilidadID(idDisp: number): Promise<Reserva[]>;
  getReservasByJugadorID(idJugador: number): Promise<Reserva[]>;
  getReservaByID(id: number): Promise<Reserva>;
  crearReserva(res: CrearReserva & { precio: Decimal }): Promise<Reserva>;
  existsReservaByDate(idDisp: number, fecha: Date): Promise<boolean>;
}

export class PrismaReservaRepository implements ReservaRepository {
  private prisma: PrismaClient;
  private include = {
    jugador: true,
    disponibilidad: {
      include: {
        disciplina: true,
        dias: true,
      },
    },
  };

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async getReservasByDisponibilidadID(idDisp: number): Promise<Reserva[]> {
    try {
      const reservas = await this.prisma.reserva.findMany({
        where: { idDisponibilidad: idDisp },
        orderBy: [{ fechaReservada: "asc" }],
        include: this.include,
      });
      return reservas.map((r) => toRes(r));
    } catch {
      throw new InternalServerError(
        `Error al listar las reservas de la disponibilidad con id ${idDisp}`
      );
    }
  }

  async getReservasByJugadorID(idJugador: number): Promise<Reserva[]> {
    try {
      const reservas = await this.prisma.reserva.findMany({
        where: { idJugador: idJugador },
        orderBy: [{ fechaReservada: "asc" }],
        include: this.include,
      });
      return reservas.map((r) => toRes(r));
    } catch {
      throw new InternalServerError(
        `Error al listar las reservas del jugador con id ${idJugador}`
      );
    }
  }

  async getReservasByEstablecimientoID(idEst: number): Promise<Reserva[]> {
    try {
      const reservas = await this.prisma.reserva.findMany({
        where: {
          disponibilidad: { cancha: { establecimiento: { id: idEst } } },
        },
        orderBy: [{ fechaReservada: "asc" }],
        include: this.include,
      });
      return reservas.map((r) => toRes(r));
    } catch {
      throw new InternalServerError(
        `Error al listar las reservas del establecimiento con id ${idEst}`
      );
    }
  }

  async getReservaByID(id: number): Promise<Reserva> {
    return awaitQuery(
      this.prisma.reserva.findUnique({
        where: { id },
        include: this.include,
      }),
      `No existe reserva con id ${id}`,
      "Error al intentar obtener la reserva"
    );
  }

  async crearReserva(
    res: CrearReserva & { precio: Decimal }
  ): Promise<Reserva> {
    try {
      const dbRes = await this.prisma.reserva.create({
        data: {
          id: undefined,
          fechaReservada: res.fechaReservada,
          precio: res.precio,
          jugador: { connect: { id: res.idJugador } },
          disponibilidad: { connect: { id: res.idDisponibilidad } },
        },
        include: this.include,
      });

      return toRes(dbRes);
    } catch {
      throw new InternalServerError("No se pudo crear la reserva");
    }
  }

  /**
   * Devuelve si una reserva de cierta disponibilidad en cierta fecha ya existe.
   * Sirve para validar que la misma fecha de una disponibilidad no se reserve dos veces.
   */
  async existsReservaByDate(idDisp: number, fecha: Date): Promise<boolean> {
    try {
      const reserva = await this.prisma.reserva.findUnique({
        where: {
          idDisponibilidad_fechaReservada: {
            idDisponibilidad: idDisp,
            fechaReservada: fecha,
          },
        },
        include: this.include,
      });

      return reserva !== null;
    } catch {
      throw new InternalServerError("Error al consultar la reserva en la DB");
    }
  }
}

type reservaDB = reserva & {
  jugador: jugador;
  disponibilidad: disponibilidadDB;
};

function toRes(res: reservaDB): Reserva {
  const { clave, ...jugador } = res.jugador;
  return { ...res, jugador, disponibilidad: toDisp(res.disponibilidad) };
}

async function awaitQuery(
  promise: Promise<reservaDB | null>,
  notFoundMsg: string,
  errorMsg: string
): Promise<Reserva> {
  try {
    const cancha = await promise;

    if (cancha) {
      return toRes(cancha);
    }
  } catch {
    throw new InternalServerError(errorMsg);
  }
  throw new NotFoundError(notFoundMsg);
}