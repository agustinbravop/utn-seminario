import { Cancha } from "../models/cancha.js";
import { InternalServerError, NotFoundError } from "../utils/apierrors.js";
import {
  PrismaClient,
  cancha,
  dia,
  disciplina,
  disponibilidad,
} from "@prisma/client";
import { DisponibilidadRepository, toDisp } from "./disponibilidades.js";
import { Establecimiento } from "../models/establecimiento.js";
import { toEst } from "./establecimientos.js";

export interface CanchaRepository {
  getByEstablecimientoID(idEst: number): Promise<Cancha[]>;
  getByDisponibilidadID(idDisp: number): Promise<Cancha>;
  getByID(idCancha: number): Promise<Cancha>;
  getEstablecimiento(idCancha: number): Promise<Establecimiento>;
  crear(cancha: Cancha): Promise<Cancha>;
  modificar(canchaUpdate: Cancha): Promise<Cancha>;
  eliminar(idCancha: number): Promise<Cancha>;
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
  private dispRepository: DisponibilidadRepository;

  constructor(
    prismaClient: PrismaClient,
    dispRepository: DisponibilidadRepository
  ) {
    this.prisma = prismaClient;
    this.dispRepository = dispRepository;
  }

  async getEstablecimiento(idCancha: number) {
    try {
      const est = await this.prisma.cancha.findUnique({
        where: { id: idCancha },
        include: {
          establecimiento: {
            include: {
              localidad: true,
              canchas: { include: { disponibilidades: true } },
            },
          },
        },
      });
      if (!est) {
        throw new NotFoundError(`No existe cancha con id ${idCancha}`);
      }

      return toEst(est.establecimiento);
    } catch {
      throw new InternalServerError(
        "Error al intentar obtener el establecimento de la cancha"
      );
    }
  }

  async getByEstablecimientoID(idEst: number) {
    try {
      const canchas = await this.prisma.cancha.findMany({
        where: {
          idEstablecimiento: idEst,
          eliminada: false,
        },
        orderBy: [{ nombre: "asc" }],
        include: this.include,
      });
      return canchas.map((c) => toCancha(c));
    } catch {
      throw new InternalServerError("Error al intentar listar las canchas");
    }
  }

  async getByID(idCancha: number) {
    return awaitQuery(
      this.prisma.cancha.findUnique({
        where: { id: idCancha },
        include: this.include,
      }),
      `No existe cancha con id ${idCancha}`,
      "Error al intentar obtener la cancha"
    );
  }

  async getByDisponibilidadID(idDisp: number) {
    const disp = await this.dispRepository.getByID(idDisp);

    return await this.getByID(disp.idCancha);
  }

  async crear(cancha: Cancha) {
    try {
      const dbCancha = await this.prisma.cancha.create({
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

      return toCancha(dbCancha);
    } catch {
      throw new InternalServerError(
        "Error interno al intentar cargar la cancha"
      );
    }
  }

  async modificar(cancha: Cancha) {
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
      // Si una disponibilidad tiene `id`, se la modifica. Si su id no existe, se lanza un error.
      await Promise.all(
        cancha.disponibilidades.map(async (disp) => {
          await this.dispRepository.modificar(disp);
        })
      );

      return await this.getByID(id);
    } catch {
      throw new InternalServerError(
        "Error interno al intentar modificar la cancha"
      );
    }
  }

  async eliminar(idCancha: number) {
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

type disponibilidadDB = Omit<disponibilidad, "idDisciplina"> & {
  disciplina: disciplina;
  dias: dia[];
};

type canchaDB = cancha & {
  disponibilidades: disponibilidadDB[];
};

function toCancha(cancha: canchaDB): Cancha {
  return {
    ...cancha,
    disciplinas: [
      ...new Set(cancha.disponibilidades.map((d) => d.disciplina.disciplina)),
    ],
    disponibilidades: cancha.disponibilidades.map((d) => toDisp(d)),
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
      return toCancha(cancha);
    }
  } catch {
    throw new InternalServerError(errorMsg);
  }
  throw new NotFoundError(notFoundMsg);
}