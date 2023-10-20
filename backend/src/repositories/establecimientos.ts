import { PrismaClient, establecimiento, localidad } from "@prisma/client";
import { InternalServerError, NotFoundError } from "../utils/apierrors.js";
import { Establecimiento } from "../models/establecimiento.js";
import { getDiaDeSemana } from "../utils/dates.js";
import { Busqueda } from "../services/establecimientos.js";

export interface EstablecimientoRepository {
  crear(est: Establecimiento): Promise<Establecimiento>;
  getByAdminID(idAdmin: number): Promise<Establecimiento[]>;
  getDeletedByAdminID(idAdmin: number): Promise<Establecimiento[]>;
  getByID(idEstablecimiento: number): Promise<Establecimiento>;
  buscar(filtro: Busqueda): Promise<Establecimiento[]>;
  getEstablecimientosByDisciplina(
    disciplina: string
  ): Promise<Establecimiento[]>;
  modificar(est: Establecimiento): Promise<Establecimiento>;
  eliminar(idEst: number): Promise<Establecimiento>;
  getAll(): Promise<Establecimiento[]>;
  getByFechaDisponible(fecha: Date): Promise<Establecimiento[]>;
}

export class PrismaEstablecimientoRepository
  implements EstablecimientoRepository
{
  private prisma: PrismaClient;
  private include = { localidad: true };

  constructor(client: PrismaClient) {
    this.prisma = client;
  }
  async getAll(): Promise<Establecimiento[]> {
    try {
      const allEstab = await this.prisma.establecimiento.findMany({
        include: this.include,
      });
      return allEstab.map((e) => toEst(e));
    } catch (e) {
      console.error(e);
      throw new InternalServerError("No se pudo obtener los establecimientos");
    }
  }

  async crear(est: Establecimiento) {
    try {
      const dbEst = await this.prisma.establecimiento.create({
        data: {
          id: undefined,
          nombre: est.nombre,
          correo: est.correo,
          direccion: est.direccion,
          telefono: est.telefono,
          urlImagen: est.urlImagen,
          horariosDeAtencion: est.horariosDeAtencion,
          administrador: { connect: { id: est.idAdministrador } },
          localidad: {
            connectOrCreate: {
              where: {
                nombre_idProvincia: {
                  nombre: est.localidad,
                  idProvincia: est.provincia,
                },
              },
              create: {
                nombre: est.localidad,
                provincia: {
                  connectOrCreate: {
                    where: { provincia: est.provincia },
                    create: { provincia: est.provincia },
                  },
                },
              },
            },
          },
        },
        include: this.include,
      });
      return toEst(dbEst);
    } catch (e) {
      throw new InternalServerError("No se pudo crear el establecimiento");
    }
  }

  async getByID(idEst: number) {
    return awaitQuery(
      this.prisma.establecimiento.findUnique({
        where: { id: idEst },
        include: this.include,
      }),
      `No existe establecimiento con id ${idEst}`,
      "Error al intentar obtener el establecimiento"
    );
  }

  async getByAdminID(idAdmin: number) {
    try {
      const estsDB = await this.prisma.establecimiento.findMany({
        where: { AND: [{ idAdministrador: idAdmin }, { eliminado: false }] },
        include: this.include,
      });

      return estsDB.map((estDB) => toEst(estDB));
    } catch (e) {
      throw new InternalServerError("No se pudo obtener los establecimientos");
    }
  }

  async getDeletedByAdminID(idAdmin: number) {
    try {
      const estsDB = await this.prisma.establecimiento.findMany({
        where: {
          AND: [{ idAdministrador: idAdmin }, { eliminado: true }],
        },
        include: this.include,
      });

      return estsDB.map((estDB) => toEst(estDB));
    } catch {
      throw new InternalServerError("No se pudo obtener los establecimientos");
    }
  }

  async modificar(est: Establecimiento) {
    return awaitQuery(
      this.prisma.establecimiento.update({
        where: { id: est.id },
        data: {
          nombre: est.nombre,
          correo: est.correo,
          habilitado: est.habilitado,
          direccion: est.direccion,
          eliminado: est.eliminado,
          telefono: est.telefono,
          urlImagen: est.urlImagen,
          horariosDeAtencion: est.horariosDeAtencion,
          administrador: { connect: { id: est.idAdministrador } },
          localidad: {
            connectOrCreate: {
              where: {
                nombre_idProvincia: {
                  nombre: est.localidad,
                  idProvincia: est.provincia,
                },
              },
              create: {
                nombre: est.localidad,
                provincia: {
                  connectOrCreate: {
                    where: { provincia: est.provincia },
                    create: { provincia: est.provincia },
                  },
                },
              },
            },
          },
        },
        include: this.include,
      }),
      `No existe establecimiento con id ${est.id}`,
      "Error al intentar modificar el establecimiento"
    );
  }

  async eliminar(idEst: number) {
    return awaitQuery(
      this.prisma.establecimiento.update({
        where: { id: Number(idEst) },
        data: { eliminado: true },
        include: this.include,
      }),
      `No existe establecimiento con id ${idEst}`,
      "Error al intentar modificar el establecimiento"
    );
  }

  //Busca los establecimientos por disciplina
  async getEstablecimientosByDisciplina(
    disciplina: string
  ): Promise<Establecimiento[]> {
    const dispDB = await this.prisma.disponibilidad.findMany({
      where: { idDisciplina: disciplina },
      include: {
        cancha: {
          include: {
            establecimiento: {
              include: {
                localidad: true,
              },
            },
          },
        },
      },
    });

    return dispDB.map((d) => toEst(d.cancha.establecimiento));
  }

  async buscar(filtros: Busqueda): Promise<Establecimiento[]> {
    const estsDB = await this.prisma.establecimiento.findMany({
      where: {
        AND: [
          {
            ...(filtros.nombre
              ? {
                  nombre: {
                    contains: filtros.nombre,
                    mode: "insensitive", // Hace que la búsqueda sea insensible a mayúsculas y minúsculas.
                  },
                }
              : {}),
          },
          {
            canchas: {
              some: {
                disponibilidades: {
                  some: { idDisciplina: filtros.disciplina },
                },
              },
            },
          },
          {
            ...(filtros.localidad
              ? {
                  localidad: {
                    nombre: {
                      equals: filtros.localidad,
                      mode: "insensitive",
                    },
                    idProvincia: {
                      equals: filtros.provincia,
                      mode: "insensitive",
                    },
                  },
                }
              : {}),
          },
          {
            ...(filtros.provincia
              ? {
                  localidad: {
                    idProvincia: {
                      equals: filtros.provincia,
                      mode: "insensitive",
                    },
                  },
                }
              : {}),
          },
        ],
        habilitado: filtros.habilitado,
        eliminado: false,
      },
      include: {
        localidad: true,
      },
    });

    return estsDB.map((ests) => toEst(ests));
  }

  //REVISAR
  /** Devuelve los establecimientos con al menos una disponibilidad libre en la fecha dada. */
  async getByFechaDisponible(fecha: Date): Promise<Establecimiento[]> {
    const estabs = await this.prisma.establecimiento.findMany({
      where: {
        canchas: {
          some: {
            disponibilidades: {
              some: {
                dias: {
                  // Verificar si el día de la semana está incluido en el array de día.
                  some: {
                    dia: { equals: getDiaDeSemana(fecha), mode: "insensitive" },
                  },
                },
                AND: {
                  // No debe haber reservas para esta fecha
                  reservas: { none: { fechaReservada: fecha } },
                },
              },
            },
          },
        },
      },
      include: this.include,
    });

    return estabs.map((ests) => toEst(ests));
  }
}

type establecimientoDB = establecimiento & {
  localidad: localidad;
};

export function toEst(est: establecimientoDB): Establecimiento {
  return {
    ...est,
    localidad: est.localidad.nombre,
    provincia: est.localidad.idProvincia,
  };
}

async function awaitQuery(
  promise: Promise<establecimientoDB | null>,
  notFoundMsg: string,
  errorMsg: string
): Promise<Establecimiento> {
  try {
    const estDB = await promise;

    if (estDB) {
      return toEst(estDB);
    }
  } catch {
    throw new InternalServerError(errorMsg);
  }

  throw new NotFoundError(notFoundMsg);
}
