import { PrismaClient, establecimiento, localidad } from "@prisma/client";
import { InternalServerError, NotFoundError } from "../utils/apierrors.js";
import { Establecimiento } from "../models/establecimiento.js";

export interface EstablecimientoRepository {
  crear(est: Establecimiento): Promise<Establecimiento>;
  getByAdminID(idAdmin: number): Promise<Establecimiento[]>;
  getDeletedByAdminID(idAdmin: number): Promise<Establecimiento[]>;
  getByID(idEstablecimiento: number): Promise<Establecimiento>;
  getEstablecimientoAll(): Promise<Establecimiento[]>;
  getEstabsByFiltro(filtro: Busqueda): Promise<Establecimiento[]>;
  getEstablecimientoDisciplina(disciplina: string): Promise<Establecimiento[]>;
  modificar(est: Establecimiento): Promise<Establecimiento>;
  eliminar(idEst: number): Promise<Establecimiento>;
  getAll(): Promise<Establecimiento[]>;
  getEstabDispByDate(fecha: string): Promise<Establecimiento[]>;
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
      return allEstab.map((e) => toModel(e));
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
      return toModel(dbEst);
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
        where: {
          AND: [{ idAdministrador: idAdmin }, { eliminado: false }],
        },
        include: this.include,
      });

      return estsDB.map((estDB) => toModel(estDB));
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

      return estsDB.map((estDB) => toModel(estDB));
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
  async getEstablecimientoDisciplina(
    disciplina: string
  ): Promise<Establecimiento[]> {
    const disDB = await this.prisma.disponibilidad.findMany({
      where: {
        idDisciplina: disciplina,
      },
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

    const arreglo = new Array();
    disDB.map((dis) => {
      arreglo.push(dis.cancha.establecimiento);
    });
    return arreglo;
  }

  //Busca los establecimientos por nombre

  //Lista todos los establecimientos, esto sirve para aplicar alguna logica de negocio capaz,
  //REVISAR

  async getEstablecimientoAll(): Promise<Establecimiento[]> {
    const estDB = await this.prisma.establecimiento.findMany({
      include: this.include,
    });

    return estDB.map((est) => toModel(est));
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

    return estsDB.map((ests) => toModel(ests));
  }

  //REVISAR
  //Me devuelve los estabs que tienen al menos 1 disponibilidad libre en una cierta fecha
  async getEstabDispByDate(fecha: string): Promise<Establecimiento[]> {
    const estabs = await this.prisma.establecimiento.findMany({
      where: {
        canchas: {
          //Busco en todas las canchas
          some: {
            //Busco en todas las disponibilidades
            //OR: [

            disponibilidades: {
              some: {
                reservas: {
                  some: {
                    //Que al menos 1 no tenga la fecha de reserva elegida
                    fechaReservada: {
                      equals: new Date(fecha).toISOString(),
                    },
                  },
                },
              },
            },

            /*
              {
                disponibilidades: {
                  some:{
                    reservas: {
                      isEmpty: true, //OR comentado xq esta parte no funcona
                      //Lo ignoro por ahora, me lo apunto para corregir dsps (Aldo)
                    },
                  }
                },
              },*/
            //    ],
          },
        },
      },
      include: this.include,
    });

    return estabs.map((ests) => toModel(ests));
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

function toModel(est: establecimientoDB): Establecimiento {
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
      return toModel(estDB);
    }
  } catch (e) {
    throw new InternalServerError(errorMsg);
  }

  throw new NotFoundError(notFoundMsg);
}
