import { Cancha } from "../models/cancha.js";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../utils/apierrors.js";
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
        include: { establecimiento: { include: { localidad: true } } },
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
      validarDisponibilidades(cancha);
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

      // Creo las disponibilidades por separado, por limitaciones de Prisma
      await Promise.all(
        cancha.disponibilidades.map(async (disp) => {
          await this.dispRepository.crear(disp);
        })
      );

      return await this.getByID(id);
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

function validarDisponibilidades(cancha: Cancha): void {
  const disp = cancha.disponibilidades.filter(
    (disp) => Number(disp.horaFin) <= Number(disp.horaInicio)
  );
  //Valida que la hora de finalizacion no sea menor que la hora de inicio
  if (disp.length >= 1) {
    throw new BadRequestError(
      "La hora de finalización no puede ser menor que la hora de inicio."
    );
  }

  //Valida que el precio de la seña no supere el precio de la reserva
  cancha.disponibilidades.filter((elemento) => {
    if (
      elemento.precioSenia !== undefined &&
      Number(elemento.precioSenia) > Number(elemento.precioReserva)
    ) {
      throw new BadRequestError(
        "El valor de la seña no puede ser mayor que el precio de la reserva."
      );
    }
  });

  var dict = {};
  var Lista = new Array();

  cancha.disponibilidades.map((elemento) => {
    elemento.dias.map((dia) => {
      dict = {
        dia: dia,
        horaInicio: elemento.horaInicio,
        horaFinal: elemento.horaFin,
      };

      Lista.push(dict);
    });
  });
  //Verifica que dos o mas disponibilidades no esten solapadas en los horarios
  for (var i = 0; i < Lista.length; i++) {
    for (var j = i + 1; j < Lista.length; j++) {
      if (Lista[i].dia == Lista[j].dia) {
        if (
          Lista[j].horaI >= Lista[i].horaI &&
          Lista[j].horaI < Lista[i].horaF
        ) {
          throw new BadRequestError(
            "Error en el registro de disponibilidades. Intente de nuevo"
          );
        }
      }
    }
  }
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
