import { Cancha } from "../models/cancha.js";
import { ApiError } from "../utils/apierrors.js";
import { Result, ok, err } from "neverthrow";
import { PrismaClient, cancha, disciplina } from "@prisma/client";

export interface CanchaRepository {
  getCanchasByEstablecimientoID(
    idEst: number
  ): Promise<Result<Cancha[], ApiError>>;
  getCanchaByID(idCancha: number): Promise<Result<Cancha, ApiError>>;
  crearCancha(cancha: Cancha): Promise<Result<Cancha, ApiError>>;
  modificarCancha(canchaUpdate: Cancha): Promise<Result<Cancha, ApiError>>;
}

export class PrismaCanchaRepository implements CanchaRepository {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async getCanchasByEstablecimientoID(
    idEst: number
  ): Promise<Result<Cancha[], ApiError>> {
    try {
      const canchas = await this.prisma.cancha.findMany({
        where: {
          idEstablecimiento: idEst,
        },
        orderBy: [
          {
            nombre: "asc",
          },
        ],
        include: {
          disciplinas: true,
        },
      });
      return ok(canchas.map((c) => toModel(c)));
    } catch (e) {
      console.error(e);
      return err(new ApiError(500, "Error al intentar listar las canchas"));
    }
  }

  async getCanchaByID(idCancha: number): Promise<Result<Cancha, ApiError>> {
    return awaitQuery(
      this.prisma.cancha.findUniqueOrThrow({
        where: {
          id: idCancha,
        },
        include: {
          disciplinas: true,
        },
      }),
      `No existe cancha con id ${idCancha}`,
      "Error interno al intentar buscar la cancha"
    );
  }

  async crearCancha(cancha: Cancha): Promise<Result<Cancha, ApiError>> {
    console.log(cancha);

    try {
      const canchaCreada = await this.prisma.cancha.create({
        data: {
          nombre: cancha.nombre,
          descripcion: cancha.descripcion,
          estaHabilitada: Boolean(cancha.estaHabilitada),
          urlImagen: cancha.urlImagen,
          idEstablecimiento: Number(cancha.idEstablecimiento),
          // disciplinas: {
          //   connectOrCreate: cancha.disciplinas.map((d) => ({
          //     where: { disciplina: d },
          //     create: { disciplina: d },
          //   })),
          // },
        },
        include: {
          disciplinas: true,
        },
      });
      return ok(toModel(canchaCreada));
    } catch (e) {
      console.error(e);
      return err(
        new ApiError(500, "Error interno al intentar cargar la cancha")
      );
    }
  }

  async modificarCancha(cancha: Cancha): Promise<Result<Cancha, ApiError>> {
    return awaitQuery(
      this.prisma.cancha.update({
        where: {
          id: cancha.id,
        },
        include: {
          disciplinas: true,
        },
        data: {
          nombre: cancha.nombre,
          descripcion: cancha.descripcion,
          urlImagen: cancha.urlImagen,
          estaHabilitada: cancha.estaHabilitada,
          // disciplinas: {
          //   connectOrCreate: cancha.disciplinas.map((d) => ({
          //     where: { disciplina: d },
          //     create: { disciplina: d },
          //   })),
          // },
        },
      }),
      `No existe cancha con id ${cancha.id}`,
      "Error interno al intentar modificar la cancha"
    );
  }
}

type canchaDB = cancha & { disciplinas: disciplina[] };

function toModel(cancha: canchaDB): Cancha {
  return {
    ...cancha,
    disciplinas: cancha.disciplinas.map((d) => d.disciplina),
  };
}

async function awaitQuery(
  promise: Promise<canchaDB | null>,
  notFoundMsg: string,
  errorMsg: string
): Promise<Result<Cancha, ApiError>> {
  try {
    const cancha = await promise;

    if (cancha === null) {
      return err(new ApiError(404, notFoundMsg));
    }
    return ok(toModel(cancha));
  } catch (e) {
    console.error(e);
    return err(new ApiError(500, errorMsg));
  }
}
