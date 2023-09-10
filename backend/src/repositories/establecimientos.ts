import { PrismaClient, establecimiento, localidad } from "@prisma/client";
import {
  InternalServerError,
  NotFoundError,
} from "../utils/apierrors.js";
import { Establecimiento } from "../models/establecimiento.js";

export interface EstablecimientoRepository {
  crear(est: Establecimiento): Promise<Establecimiento>;
  getByAdminID(idAdmin: number): Promise<Establecimiento[]>;
  getByID(idEstablecimiento: number): Promise<Establecimiento>;
  getEstablecimientoAll(): Promise<Establecimiento[]>;
  getEstabsByFiltro(filtro: Busqueda): Promise<Establecimiento[]>;
  getEstablecimientoDisciplina(disciplina:string): Promise<Establecimiento[]>
  modificar(est: Establecimiento): Promise<Establecimiento>;
  eliminar(idEst: number): Promise<Establecimiento>;
}

export class PrismaEstablecimientoRepository
  implements EstablecimientoRepository
{
  private prisma: PrismaClient;
  private include = { localidad: true };

  constructor(client: PrismaClient) {
    this.prisma = client;
  }

  async crear(est: Establecimiento): Promise<Establecimiento> {
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
      console.error(e);
      throw new InternalServerError("No se pudo crear el establecimiento");
    }
  }

  async getByID(idEst: number): Promise<Establecimiento> {
    return awaitQuery(
      this.prisma.establecimiento.findUnique({
        where: { id: idEst },
        include: this.include,
      }),
      `No existe establecimiento con id ${idEst}`,
      "Error al intentar obtener el establecimiento"
    );
  }

  async getByAdminID(idAdmin: number): Promise<Establecimiento[]> {
    try {
      const estsDB = await this.prisma.establecimiento.findMany({
        where: {
          AND: [{ idAdministrador: idAdmin }, { eliminado: false }],
        },
        include: this.include,
      });

      return estsDB.map((estDB) => toModel(estDB));
    } catch (e) {
      console.error(e);
      throw new InternalServerError("No se pudo obtener los establecimientos");
    }
  }

  async modificar(est: Establecimiento): Promise<Establecimiento> {
    return awaitQuery(
      this.prisma.establecimiento.update({
        where: { id: est.id },
        data: {
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
      }),
      `No existe establecimiento con id ${est.id}`,
      "Error al intentar modificar el establecimiento"
    );
  }

  async eliminar(idEst: number): Promise<Establecimiento> {
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
       idDisciplina:disciplina
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
                  nombre: params.nombre,
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
}

type Busqueda = {
  nombre?: string;
  provincia?: string;
  localidad?: string;
  disciplina?: string;
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
    console.error(e);
    throw new InternalServerError(errorMsg);
  }

  throw new NotFoundError(notFoundMsg);
}
