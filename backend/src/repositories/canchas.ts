import { Cancha, Dia } from "../models/cancha.js";
import { InternalServerError, NotFoundError } from "../utils/apierrors.js";
import {
  PrismaClient,
  cancha,
  dia,
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
        dias: true,
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
        where: { id: idCancha },
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

      console.log(cancha);
      // Creo las disponibilidades por separado, por limitaciones de Prisma
      await Promise.all(
        cancha.disponibilidades.map(async (disp) => {
          await this.prisma.disponibilidad.create({
            data: {
              horaFin: disp.horaFin,
              horaInicio: disp.horaInicio,
              precioReserva: disp.precioReserva,
              precioSenia: disp.precioSenia,
              dias: { connect: disp.dias.map((dia) => ({ dia })) },
              cancha: { connect: { id } },
              disciplina: {
                connectOrCreate: {
                  where: { disciplina: disp.disciplina },
                  create: { disciplina: disp.disciplina },
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

      // Modifico las disponibilidades por separado, por limitaciones de Prisma.
      // Si una disponibilidad tiene `id`, se la modifica. Si su id no existe, se crea.
      await Promise.all(
        cancha.disponibilidades.map(async (disp) => {
          await this.prisma.disponibilidad.upsert({
            where: { id: disp.id },
            create: {
              horaFin: disp.horaFin,
              horaInicio: disp.horaInicio,
              precioReserva: disp.precioReserva,
              precioSenia: disp.precioSenia,
              dias: { connect: disp.dias.map((dia) => ({ dia })) },
              cancha: { connect: { id: id } },
              disciplina: {
                connectOrCreate: {
                  where: { disciplina: disp.disciplina },
                  create: { disciplina: disp.disciplina },
                },
              },
            },
            update: {
              horaFin: disp.horaFin,
              horaInicio: disp.horaInicio,
              precioReserva: disp.precioReserva,
              precioSenia: disp.precioSenia,
              dias: { connect: disp.dias.map((dia) => ({ dia })) },
              cancha: { connect: { id: id } },
              disciplina: {
                connectOrCreate: {
                  where: { disciplina: disp.disciplina },
                  create: { disciplina: disp.disciplina },
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
        where: { id: idCancha },
        data: { eliminada: true },
        include: this.include,
      }),
      `No existe cancha con id ${idCancha}`,
      "Error interno al intentar modificar la cancha"
    );
  }
}

type disponibilidadDB = Omit<disponibilidad, "idDisciplina" | "idCancha"> & {
  disciplina: disciplina;
  dias: dia[];
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
      dias: d.dias.map((dia) => dia.dia) as Dia[],
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
