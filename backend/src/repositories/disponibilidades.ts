import { DIAS, Dia, Disponibilidad } from "../models/disponibilidad.js";
import { BuscarDisponibilidadesQuery } from "../services/disponibilidades.js";
import { InternalServerError, NotFoundError } from "../utils/apierrors.js";
import { PrismaClient, dia, disciplina, disponibilidad } from "@prisma/client";
import { getDiaDeSemana } from "../utils/dates.js";

export interface DisponibilidadRepository {
  getByCanchaID(idCancha: number): Promise<Disponibilidad[]>;
  getByAdminID(idAdmin: number): Promise<Disponibilidad[]>;
  getByID(idDisp: number): Promise<Disponibilidad>;
  buscar(filtros: BuscarDisponibilidadesQuery): Promise<Disponibilidad[]>;
  crear(disp: Disponibilidad): Promise<Disponibilidad>;
  modificar(dispUpdate: Disponibilidad): Promise<Disponibilidad>;
  eliminar(idDisp: number): Promise<Disponibilidad>;
}

export class PrismaDisponibilidadRepository
  implements DisponibilidadRepository
{
  private prisma: PrismaClient;
  private include = {
    disciplina: true,
    dias: true,
    cancha: true,
  };

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async getByCanchaID(idCancha: number) {
    try {
      const canchas = await this.prisma.disponibilidad.findMany({
        where: { idCancha: idCancha },
        orderBy: [{ horaInicio: "asc" }],
        include: this.include,
      });
      return canchas.map((c) => toDisp(c));
    } catch {
      throw new InternalServerError("Error al listar las disponibilidades");
    }
  }

  async getByAdminID(idAdmin: number) {
    try {
      const canchas = await this.prisma.disponibilidad.findMany({
        where: { cancha: { establecimiento: { idAdministrador: idAdmin } } },
        orderBy: [{ horaInicio: "asc" }],
        include: this.include,
      });
      return canchas.map((c) => toDisp(c));
    } catch {
      throw new InternalServerError("Error al listar las disponibilidades");
    }
  }

  async getByID(idDisp: number) {
    return awaitQuery(
      this.prisma.disponibilidad.findUnique({
        where: { id: idDisp },
        include: this.include,
      }),
      `No existe disponibilidad con id ${idDisp}`,
      "Error al intentar obtener la disponibilidad"
    );
  }

  async buscar(filtros: BuscarDisponibilidadesQuery) {
    try {
      const disps = await this.prisma.disponibilidad.findMany({
        where: {
          idDisciplina: filtros.disciplina,
          cancha: {
            id: filtros.idCancha,
            idEstablecimiento: filtros.idEst,
          },
          ...(filtros.fechaDisponible
            ? {
                // Solo trae disponibilidades no reservadas en la `fechaDisponible`.
                reservas: {
                  none: { fechaReservada: filtros.fechaDisponible },
                },
                // Solo trae disponibilidades válidas para el día de `fechaDisponible`.
                dias: {
                  some: { dia: getDiaDeSemana(filtros.fechaDisponible) },
                },
              }
            : {}),
        },
        include: this.include,
      });
      return disps.map((d) => toDisp(d));
    } catch {
      throw new InternalServerError("Error al buscar las disponibilidades");
    }
  }

  async crear(disp: Disponibilidad) {
    try {
      const dbDisp = await this.prisma.disponibilidad.create({
        data: {
          horaFin: disp.horaFin,
          horaInicio: disp.horaInicio,
          precioReserva: disp.precioReserva,
          precioSenia: disp.precioSenia,
          dias: { connect: disp.dias.map((dia) => ({ dia })) },
          cancha: { connect: { id: disp.idCancha } },
          disciplina: {
            connectOrCreate: {
              where: { disciplina: disp.disciplina },
              create: { disciplina: disp.disciplina },
            },
          },
        },
        include: this.include,
      });

      return toDisp(dbDisp);
    } catch {
      throw new InternalServerError("No se pudo crear la disponibilidad");
    }
  }

  async modificar(disp: Disponibilidad) {
    return awaitQuery(
      this.prisma.disponibilidad.update({
        where: { id: disp.id },
        data: {
          horaFin: disp.horaFin,
          horaInicio: disp.horaInicio,
          precioReserva: disp.precioReserva,
          precioSenia: disp.precioSenia,
          dias: {
            connect: disp.dias.map((dia) => ({ dia })),
            disconnect: DIAS.filter((dia) => !disp.dias.includes(dia)).map(
              (dia) => ({ dia })
            ),
          },
          cancha: { connect: { id: disp.idCancha } },
          disciplina: {
            connectOrCreate: {
              where: { disciplina: disp.disciplina },
              create: { disciplina: disp.disciplina },
            },
          },
        },
        include: this.include,
      }),
      `No existe la disponibilidad con id ${disp.id}`,
      "Error interno al intentar modificar la disponibilidad"
    );
  }

  async eliminar(idDisp: number) {
    return awaitQuery(
      this.prisma.disponibilidad.delete({
        where: { id: idDisp },
        include: this.include,
      }),
      `No existe disponibilidad con id ${idDisp}`,
      "Error interno al intentar eliminar la disponibilidad"
    );
  }
}

export type disponibilidadDB = Omit<disponibilidad, "idDisciplina"> & {
  disciplina: disciplina;
  dias: dia[];
};

export function toDisp(disp: disponibilidadDB): Disponibilidad {
  return {
    ...disp,
    disciplina: disp.disciplina.disciplina,
    precioReserva: disp.precioReserva.toNumber(),
    precioSenia: disp.precioSenia?.toNumber() ?? undefined,
    dias: disp.dias.map((dia) => dia.dia) as Dia[],
  };
}

async function awaitQuery(
  promise: Promise<disponibilidadDB | null>,
  notFoundMsg: string,
  errorMsg: string
): Promise<Disponibilidad> {
  try {
    const disp = await promise;

    if (disp) {
      return toDisp(disp);
    }
  } catch {
    throw new InternalServerError(errorMsg);
  }
  throw new NotFoundError(notFoundMsg);
}
