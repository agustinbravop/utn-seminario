import { PrismaClient, establecimiento, localidad } from "@prisma/client";
import { InternalServerError, NotFoundError } from "../utils/apierrors.js";
import { Establecimiento } from "../models/establecimiento.js";

export interface EstablecimientoRepository {
  crear(est: Establecimiento): Promise<Establecimiento>;
  getByAdminID(idAdmin: number): Promise<Establecimiento[]>;
  getDeletedByAdminID(idAdmin: number): Promise<Establecimiento[]>;
  getByID(idEstablecimiento: number): Promise<Establecimiento>;
  getEstabsByFiltro(filtro: Busqueda): Promise<Establecimiento[]>;
  getEstablecimientosByDisciplina(
    disciplina: string
  ): Promise<Establecimiento[]>;
  modificar(est: Establecimiento): Promise<Establecimiento>;
  eliminar(idEst: number): Promise<Establecimiento>;
  getAll(): Promise<Establecimiento[]>;
  getEstabDispByDate(fecha: string): Promise<Establecimiento[]>;
  verifEstabSinReserva(idEst: number): Promise<boolean>;
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

  async getEstabsByFiltro(params: Busqueda): Promise<Establecimiento[]> {
    const estsDB = await this.prisma.establecimiento.findMany({
      where: {
        AND: [
          {
            ...(params.nombre
              ? {
                  nombre: {
                    contains: params.nombre,
                    mode: "insensitive", // Hace que la búsqueda sea insensible a mayúsculas y minúsculas.
                  },
                }
              : {}),
          },
          {
            ...(params.localidad
              ? {
                  localidad: {
                    nombre: {
                      equals: params.localidad,
                      mode: "insensitive",
                    },
                    idProvincia: {
                      equals: params.provincia,
                      mode: "insensitive",
                    },
                  },
                }
              : {}),
          },
          {
            ...(params.provincia
              ? {
                  localidad: {
                    idProvincia: {
                      equals: params.provincia,
                      mode: "insensitive",
                    },
                  },
                }
              : {}),
          },
        ],
        eliminado: false,
      },
      include: {
        localidad: true,
      },
    });

    return estsDB.map((ests) => toEst(ests));
  }

  //REVISAR
  //Me devuelve los estabs que tienen al menos 1 disponibilidad libre en una cierta fecha
  async getEstabDispByDate(fecha: string): Promise<Establecimiento[]> {
    const diasSemana = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    // Obtener el día de la semana correspondiente a la fecha
    const fechaObj = new Date(fecha);
    const diaSemana = diasSemana[fechaObj.getDay()]; // Obtener el nombre del día de la semana

    // Obtener los establecimientos que cumplen con los criterios
    const estabs = await this.prisma.establecimiento.findMany({
      where: {
        canchas: {
          some: {
            disponibilidades: {
              some: {
                dias: {
                  some: {
                    dia: {
                      equals: diaSemana,
                      mode: "insensitive",
                    },
                  }, // Verificar si el día de la semana está incluido en el array de día.
                },
                AND: {
                  reservas: {
                    none: {
                      fechaReservada: fechaObj.toISOString(), // No debe haber reservas para esta fecha
                    },
                  },
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

  async verifEstabSinReserva(idEst: number): Promise<boolean> {
    const cantReservas = await this.prisma.reserva.count({
      where: {
        disponibilidad: {
          cancha: {
            idEstablecimiento: idEst,
          },
        },
      },
    });

    return cantReservas === 0;
  }
}

type Busqueda = {
  nombre?: string;
  provincia?: string;
  localidad?: string;
  disciplina?: string;
  fecha?: string;
};

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
  } catch (e) {
    throw new InternalServerError(errorMsg);
  }

  throw new NotFoundError(notFoundMsg);
}