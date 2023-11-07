import { Reserva } from "../models/reserva.js";
import { InternalServerError, NotFoundError } from "../utils/apierrors.js";
import { PrismaClient, jugador, pago, reserva } from "@prisma/client";
import { disponibilidadDB, toDisp } from "./disponibilidades.js";
import { BuscarReservaQuery, CrearReserva } from "../services/reservas.js";
import { toPago } from "./pagos.js";

type CrearReservaParam = CrearReserva & { precio: number; senia?: number };

export interface ReservaRepository {
  getReservasByEstablecimientoID(idEst: number): Promise<Reserva[]>;
  getReservasByDisponibilidadID(idDisp: number): Promise<Reserva[]>;
  getReservasByJugadorID(idJugador: number): Promise<Reserva[]>;
  getReservasByCanchaID(idCancha: number): Promise<Reserva[]>;
  getReservaByID(id: number): Promise<Reserva>;
  buscar(filtros: BuscarReservaQuery): Promise<Reserva[]>;
  crearReserva(res: CrearReservaParam): Promise<Reserva>;
  getReservasByDate(fecha: Date): Promise<Reserva[]>;
  updateReserva(res: Reserva): Promise<Reserva>;
}

export class PrismaReservaRepository implements ReservaRepository {
  private prisma: PrismaClient;
  private include = {
    jugador: true,
    disponibilidad: {
      include: {
        disciplina: true,
        dias: true,
        cancha: {
          include: {
            establecimiento: true,
          },
        },
      },
    },
    pagoReserva: true,
    pagoSenia: true,
  };

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async updateReserva(res: Reserva): Promise<Reserva> {
    try {
      const nuevaReserva = await this.prisma.reserva.update({
        where: { id: res.id },
        data: {
          fechaCreada: res.fechaCreada, //falta congelar el precio de la seña :)
          fechaReservada: res.fechaReservada,
          precio: res.precio,
          estado: res.estado,
          jugador: res.jugador
            ? { connect: { id: res.jugador?.id } }
            : undefined ,
          disponibilidad: { connect: { id: res.disponibilidad.id } },
          pagoReserva: res.pagoReserva
            ? { connect: { id: res.pagoReserva.id } }
            : undefined,
          pagoSenia: res.pagoSenia
            ? { connect: { id: res.pagoSenia.id } }
            : undefined,
        },
        include: this.include,
      });
      return toRes(nuevaReserva);
    } catch (error) {
      throw new InternalServerError("Error al intentar actualizar la reserva");
    }
  }

  async getReservasByDisponibilidadID(idDisp: number) {
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

  async getReservasByJugadorID(idJugador: number) {
    try {
      const reservas = await this.prisma.reserva.findMany({
        where: { idJugador: idJugador,
                estado: true  },
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

  async getReservasByCanchaID(idCancha: number) {
    try {
      const reservas = await this.prisma.reserva.findMany({
        where: { disponibilidad: { idCancha: idCancha } },
        orderBy: [{ fechaReservada: "asc" }],
        include: this.include,
      });
      return reservas.map((r) => toRes(r));
    } catch {
      throw new InternalServerError(
        `Error al listar las reservas del jugador con id ${idCancha}`
      );
    }
  }

  async getReservasByEstablecimientoID(idEst: number) {
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

  async getReservaByID(id: number) {
    return awaitQuery(
      this.prisma.reserva.findUnique({
        where: { id },
        include: this.include,
      }),
      `No existe reserva con id ${id}`,
      "Error al intentar obtener la reserva"
    );
  }

  async buscar(filtros: BuscarReservaQuery) {
    try {
      const reservas = await this.prisma.reserva.findMany({
        where: {
          fechaCreada: {
            gte: filtros.fechaCreadaDesde,
            lte: filtros.fechaCreadaHasta,
          },
          fechaReservada: {
            gte: filtros.fechaReservadaDesde,
            lte: filtros.fechaReservadaHasta,
          },
          disponibilidad: {
            cancha: {
              id: filtros.idCancha,
              idEstablecimiento: filtros.idEst,
            },
          },
        },
        include: this.include,
      });
      return reservas.map((p) => toRes(p));
    } catch (e) {
      console.error(e);
      throw new InternalServerError("Error interno al obtener los pagos");
    }
  }

  async crearReserva(res: CrearReservaParam) {
    console.log("Repository: ")
    console.log(res)
    /*
    try {
      const data = {
        fechaReservada: res.fechaReservada,
        precio: res.precio,
        senia: res.senia,
        jugador: {},
        nombre: res.nombre ?? '-',
        disponibilidad: { connect: { id: res.idDisponibilidad } },
      };
      if (res.idJugador !== 0) {
        data.jugador = { connect: { id: res.idJugador } };
      }
      const dbRes = await this.prisma.reserva.create({
        data,
        include: this.include,
      }); 


      const dbRes = await this.prisma.reserva.create({
        data: {
          id: undefined,
          fechaReservada: res.fechaReservada,
          precio: res.precio,
          senia: res.senia,
          jugador: { connect: { id: res.idJugador } },
          nombre: res.nombre ?? '-',
          disponibilidad: { connect: { id: res.idDisponibilidad } },
        },
        include: this.include,
      });
    */

      //ESTO SE PUEDE MEJORAR EN CUANTO A LEGIBILIDAD
    try {
      let dbRes;
      if (res.idJugador !== 0) {
        dbRes = await this.prisma.reserva.create({
          data: {
            id: undefined,
            fechaReservada: res.fechaReservada,
            precio: res.precio,
            senia: res.senia,
            jugador: { connect: { id: res.idJugador } },
            nombre: res.nombre ?? '-',
            disponibilidad: { connect: { id: res.idDisponibilidad } },
          },
          include: this.include,
        });
      } else{
        dbRes = await this.prisma.reserva.create({
          data: {
            id: undefined,
            fechaReservada: res.fechaReservada,
            precio: res.precio,
            senia: res.senia,
            nombre: res.nombre ?? '-',
            disponibilidad: { connect: { id: res.idDisponibilidad } },
          },
          include: {disponibilidad: {
            include: {
              disciplina: true,
              dias: true,
              cancha: {
                include: {
                  establecimiento: true,
                },
              },
            },
          },
          pagoReserva: true,
          pagoSenia: true,
        },
        });
      }

      return toRes(dbRes);
    } catch(e) {
      console.log(e)
      throw new InternalServerError("No se pudo crear la reserva");
    }
  }

  /**
   * Devuelve si una reserva de cierta disponibilidad en cierta fecha ya existe.
   * Sirve para validar que la misma fecha de una disponibilidad no se reserve dos veces.
   */
  async getReservasByDate(fecha: Date) {
    try {
      const reservas = await this.prisma.reserva.findMany({
        where: { fechaReservada: fecha },
        include: this.include,
      });

      return reservas.map((r) => toRes(r));
    } catch {
      throw new InternalServerError("Error al consultar la reserva en la DB");
    }
  }
}

type ReservaDB = reserva & {
  jugador?: jugador | null;
  nombre: string | null;
  disponibilidad: disponibilidadDB;
  pagoReserva: pago | null;
  pagoSenia?: pago | null;
};

function toRes(res: ReservaDB): Reserva {
  if (res.jugador){
    const { clave, ...jugador } = res.jugador;
    return {
      ...res,
      jugador,
      nombre: res.nombre ?? "",
      senia: res.senia?.toNumber() ?? undefined,
      precio: res.precio.toNumber(),
      pagoSenia: res.pagoSenia ? toPago(res.pagoSenia) : undefined,
      pagoReserva: res.pagoReserva ? toPago(res.pagoReserva) : undefined,
      disponibilidad: toDisp(res.disponibilidad),
    };
  }
  else{
    return {
      ...res,
      jugador: undefined,
      nombre: res.nombre ?? "",
      senia: res.senia?.toNumber() ?? undefined,
      precio: res.precio.toNumber(),
      pagoSenia: res.pagoSenia ? toPago(res.pagoSenia) : undefined,
      pagoReserva: res.pagoReserva ? toPago(res.pagoReserva) : undefined,
      disponibilidad: toDisp(res.disponibilidad),
    }
  }
}

async function awaitQuery(
  promise: Promise<ReservaDB | null>,
  notFoundMsg: string,
  errorMsg: string
): Promise<Reserva> {
  try {
    const reservaDB = await promise;

    if (reservaDB) {
      return toRes(reservaDB);
    }
  } catch {
    throw new InternalServerError(errorMsg);
  }
  throw new NotFoundError(notFoundMsg);
}
