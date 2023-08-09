import { Cancha, Dia } from "../models/cancha.js";
import { InternalServerError, NotFoundError } from "../utils/apierrors.js";
import {
  PrismaClient,
  cancha,
  disciplina,
  disponibilidad,
} from "@prisma/client";

export interface CanchaRepository {
  getCanchasByEstablecimientoID(idEst: number): Promise<Cancha[]>;
  getCanchaByID(idCancha: number): Promise<Cancha>;
  crearCancha(cancha: Cancha): Promise<Cancha>;
  modificarCancha(canchaUpdate: Cancha): Promise<Cancha>;
  eliminarCancha(idCancha: number): Promise<Cancha>;
}

export class PrismaCanchaRepository implements CanchaRepository {
  private prisma: PrismaClient;
  private include = {
    disponibilidades: {
      include: {
        disciplina: true,
      },
    },
  };

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async getCanchasByEstablecimientoID(idEst: number): Promise<Cancha[]> {
    try {
      const canchas = await this.prisma.cancha.findMany({
        where: {
          idEstablecimiento: idEst,
          eliminada: false,
        },
        orderBy: [
          {
            nombre: "asc",
          },
        ],
        include: this.include,
      });
      return canchas.map((c) => toModel(c));
    } catch (e) {
      console.error(e);
      throw new InternalServerError("Error al intentar listar las canchas");
    }
  }

  async getCanchaByID(idCancha: number): Promise<Cancha> {
    return awaitQuery(
      this.prisma.cancha.findUnique({
        where: {
          id: idCancha,
          // TODO: ignorar los soft delete
        },
        include: this.include,
      }),
      `No existe cancha con id ${idCancha}`,
      "Error al intentar obtener la cancha"
    );
  }

  async crearCancha(cancha: Cancha): Promise<Cancha> {
    try {
      const { id } = await this.prisma.cancha.create({
        data: {
          nombre: cancha.nombre,
          descripcion: cancha.descripcion,
          habilitada: cancha.habilitada,
          eliminada: cancha.eliminada,
          urlImagen: cancha.urlImagen,
          idEstablecimiento: cancha.idEstablecimiento,
        },
        include: this.include,
      });

      await Promise.all(
        cancha.disponibilidades.map(async (disp) => {
          await this.prisma.disponibilidad.create({
            data: {
              horaFin: disp.horaFin,
              horaInicio: disp.horaInicio,
              minutosReserva: disp.minutosReserva,
              precioReserva: disp.precioReserva,
              precioSenia: disp.precioSenia,
              dias: disp.dias,
              disciplina: {
                connectOrCreate: {
                  where: { disciplina: disp.disciplina },
                  create: { disciplina: disp.disciplina },
                },
              },
              cancha: {
                connect: {
                  id: id,
                },
              },
            },
          });
        })
      );

      return await this.getCanchaByID(id);
    } catch (e) {
      console.error(e);
      throw new InternalServerError(
        "Error interno al intentar cargar la cancha"
      );
    }
  }

  async modificarCancha(cancha: Cancha): Promise<Cancha> {
    try {
      const { id } = await this.prisma.cancha.update({
        where: { id: cancha.id },
        data: {
          nombre: cancha.nombre,
          descripcion: cancha.descripcion,
          habilitada: cancha.habilitada,
          eliminada: cancha.eliminada,
          urlImagen: cancha.urlImagen,
          idEstablecimiento: cancha.idEstablecimiento,
        },
        include: this.include,
      });

      await Promise.all(
        cancha.disponibilidades.map(async (disp) => {
          await this.prisma.disponibilidad.update({
            where: { id: disp.id },
            data: {
              horaFin: disp.horaFin,
              horaInicio: disp.horaInicio,
              minutosReserva: disp.minutosReserva,
              precioReserva: disp.precioReserva,
              precioSenia: disp.precioSenia,
              dias: disp.dias,
              disciplina: {
                connectOrCreate: {
                  where: { disciplina: disp.disciplina },
                  create: { disciplina: disp.disciplina },
                },
              },
              cancha: {
                connect: {
                  id: id,
                },
              },
            },
          });
        })
      );

      return await this.getCanchaByID(id);
    } catch (e) {
      console.error(e);
      throw new InternalServerError(
        "Error interno al intentar modificar la cancha"
      );
    }
  }

  async eliminarCancha(idCancha: number): Promise<Cancha> {
    return awaitQuery(
      this.prisma.cancha.update({
        where: {
          id: idCancha,
        },
        include: this.include,
        data: {
          eliminada: true,
        },
      }),
      `No existe cancha con id ${idCancha}`,
      "Error interno al intentar modificar la cancha"
    );
  }
}

type disponibilidadDB = Omit<disponibilidad, "idDisciplina" | "idCancha"> & {
  disciplina: disciplina;
};

type canchaDB = cancha & {
  disponibilidades: disponibilidadDB[];
};

function toModel(cancha: canchaDB): Cancha {
  return {
    ...cancha,
    disciplinas: cancha.disponibilidades.map((d) => d.disciplina.disciplina),
    disponibilidades: cancha.disponibilidades.map((d) => ({
      ...d,
      disciplina: d.disciplina.disciplina,
      precioSenia: d.precioSenia ?? undefined,
      dias: d.dias as Dia[],
    })),
  };
}

async function awaitQuery(
  promise: Promise<canchaDB | null>,
  notFoundMsg: string,
  errorMsg: string
): Promise<Cancha> {
  try {
    const cancha = await promise;

    if (cancha) {
      return toModel(cancha);
    }
  } catch (e) {
    console.error(e);
    throw new InternalServerError(errorMsg);
  }
  throw new NotFoundError(notFoundMsg);
}
