import { DIAS, Dia, Disponibilidad } from "../models/disponibilidad.js";
import { InternalServerError, NotFoundError } from "../utils/apierrors.js";
import { PrismaClient, dia, disciplina, disponibilidad } from "@prisma/client";

export interface DisponibilidadRepository {
  getDisponibilidadesByCanchaID(idEst: number): Promise<Disponibilidad[]>;
  getDisponibilidadByID(idDisp: number): Promise<Disponibilidad>;
  crearDisponibilidad(disp: Disponibilidad): Promise<Disponibilidad>;
  modificarDisponibilidad(dispUpdate: Disponibilidad): Promise<Disponibilidad>;
  eliminarDisponibilidad(idDisp: number): Promise<Disponibilidad>;
}

export class PrismaDisponibilidadRepository
  implements DisponibilidadRepository
{
  private prisma: PrismaClient;
  private include = {
    disciplina: true,
    dias: true,
  };

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async getDisponibilidadesByCanchaID(idCancha: number) {
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

  async getDisponibilidadByID(idDisp: number) {
    return awaitQuery(
      this.prisma.disponibilidad.findUnique({
        where: { id: idDisp },
        include: this.include,
      }),
      `No existe disponibilidad con id ${idDisp}`,
      "Error al intentar obtener la disponibilidad"
    );
  }

  async crearDisponibilidad(disp: Disponibilidad) {
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

  async modificarDisponibilidad(disp: Disponibilidad) {
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

  async eliminarDisponibilidad(idDisp: number) {
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
    precioSenia: disp.precioSenia ?? undefined,
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
