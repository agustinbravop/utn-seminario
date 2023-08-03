import { Cancha } from "../models/cancha.js";
import { InternalServerError, NotFoundError } from "../utils/apierrors.js";
import { PrismaClient, cancha, disciplina } from "@prisma/client";

export interface CanchaRepository {
  getCanchasByEstablecimientoID(idEst: number): Promise<Cancha[]>;
  getCanchaByID(idCancha: number): Promise<Cancha>;
  crearCancha(cancha: Cancha): Promise<Cancha>;
  modificarCancha(canchaUpdate: Cancha): Promise<Cancha>;
  eliminarCancha(idCancha:number):Promise<Cancha>
}

export class PrismaCanchaRepository implements CanchaRepository {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async getCanchasByEstablecimientoID(idEst: number): Promise<Cancha[]> {
    try {
      const canchas = await this.prisma.cancha.findMany({
        where: {
          idEstablecimiento: idEst,
          estaEliminada: false,
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
      return canchas.map((c) => toModel(c));
    } catch (e) {
      console.error(e);
      throw new InternalServerError("Error al intentar listar las canchas");
    }
  }

  async getCanchaByID(idCancha: number): Promise<Cancha> {
    const resultCancha= this.prisma.cancha.findUniqueOrThrow({
      where: {
        id:idCancha
      },
      include: {
        disciplinas: true,
      }, 
    })
    try { 
      if ((await resultCancha).estaEliminada===true) { 
        throw new InternalServerError(`la cancha con el identificador ${idCancha} no existe intente de nuevo`)
       }

    } catch(e) { 
      throw new InternalServerError(`La cancha con el identificador ${idCancha} no existe intente de nuevo`)
    }
 
   return awaitQuery(resultCancha,
    `Cancha con id ${idCancha}`,
    " "
  )

   
   
    
  }

  async crearCancha(cancha: Cancha): Promise<Cancha> {
    try {
      const canchaCreada = await this.prisma.cancha.create({
        data: {
          nombre: cancha.nombre,
          descripcion: cancha.descripcion,
          estaHabilitada: Boolean(cancha.estaHabilitada),
          estaEliminada:false,
          urlImagen: String(cancha.urlImagen),
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
      return toModel(canchaCreada);
    } catch (e) { 
      console.error(e);
      throw new InternalServerError(
        "Error interno al intentar cargar la cancha"
      );
    }
  }

  async modificarCancha(cancha: Cancha): Promise<Cancha> {
    return awaitQuery(
      this.prisma.cancha.update({
        where: {
          id: Number(cancha.id),
        },
        include: {
          disciplinas: true,
        },
        data: {
          nombre: cancha.nombre,
          descripcion: cancha.descripcion,
          urlImagen: String(cancha.urlImagen),
          estaHabilitada: Boolean(cancha.estaHabilitada),
         
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

  async eliminarCancha(idCancha:number):Promise<Cancha> { 
    return awaitQuery(
      this.prisma.cancha.update({
        where: { 
          id: Number(idCancha),
        },
        include: {
          disciplinas: true,
        },
        data: {
          estaEliminada:true
        },
      }),
      `No existe cancha con id ${idCancha}`,
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
