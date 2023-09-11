import { Cancha } from "../models/cancha.js";
import { Dia } from "../models/disponibilidad.js";
import { BadRequestError, InternalServerError, NotFoundError } from "../utils/apierrors.js";
import {
  PrismaClient,
  cancha,
  dia,
  disciplina,
  disponibilidad,
} from "@prisma/client";
import { DisponibilidadRepository } from "./disponibilidades.js";

export interface CanchaRepository {
  getCanchasByEstablecimientoID(idEst: number): Promise<Cancha[]>;
  getCanchaByID(idCancha: number): Promise<Cancha>;
  crearCancha(cancha: Cancha): Promise<Cancha>;
  modificarCancha(canchaUpdate: Cancha): Promise<Cancha>;
  eliminarCancha(idCancha: number): Promise<Cancha>;
  getCanchasByEstabIdHabilitadas(idEst:number): Promise<Cancha[]>;
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

  async getCanchasByEstabIdHabilitadas(idEst:number) : Promise<Cancha[]>{
    try {
      const canchas = await this.prisma.cancha.findMany({
        where: {
          idEstablecimiento: idEst,
          eliminada: false,
          habilitada: true
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
      throw new InternalServerError("Error al obtener las canchas");
    }
  }

  async getCanchasByEstablecimientoID(idEst: number): Promise<Cancha[]> {
    try {
      const canchas = await this.prisma.cancha.findMany({
        where: {
          idEstablecimiento: idEst,
          eliminada: false,
        },
        orderBy: [{ nombre: "asc" }],
        include: this.include,
      });
      return canchas.map((c) => toModel(c));
    } catch {
      throw new InternalServerError("Error al intentar listar las canchas");
    }
  }

  async getCanchaByID(idCancha: number): Promise<Cancha>  {
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
    //Valida que la cancha ingresada sea unica 
    const canchas= await this.getCanchasByEstablecimientoID(cancha.idEstablecimiento)
    const array_cancha=canchas.filter((elemento)=>(elemento.nombre.toUpperCase()==cancha.nombre.toUpperCase() && elemento.habilitada==true))
    if (array_cancha.length==1){ 
      throw new BadRequestError("La cancha ingresada ya existe. Ingrese el nombre de otra cancha")
    }

    
    try {

      validarDisponibilidades(cancha)
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
          await this.dispRepository.crearDisponibilidad(disp);
        })
      );

      
      return await this.getCanchaByID(id);
    } catch {
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
      // Si una disponibilidad tiene `id`, se la modifica. Si su id no existe, se lanza un error.
      await Promise.all(
        cancha.disponibilidades.map(async (disp) => {
          await this.dispRepository.modificarDisponibilidad(disp);
        })
      );
     
      return await this.getCanchaByID(id);
    } catch {
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

type disponibilidadDB = Omit<disponibilidad, "idDisciplina"> & {
  disciplina: disciplina;
  dias: dia[]
} ;

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

function validarDisponibilidades(cancha:Cancha): void { 
  

  const disp=cancha.disponibilidades.filter((disp)=>(Number(disp.horaFin)<=Number(disp.horaInicio)))
  //Valida que la hora de finalizacion no sea menor que la hora de inicio
  if (disp.length>=1) { 
    throw new BadRequestError("La hora de finalizacion no puede ser menor que la hora de inicio. Intente de nuevo")
  }

  //Valida que el precio de la seña no supere el precio de la reserva 
  cancha.disponibilidades.filter((elemento)=>{ 
    if (elemento.precioSenia?.valueOf()!=='undefined' && Number(elemento.precioSenia)>Number(elemento.precioReserva)) { 
      throw new BadRequestError("Error el precio de la seña no puede ser mayor que el precio de la reserva. Intenta de nuevo")
    }
  })

  var dict={}
  var Lista=new Array()

  cancha.disponibilidades.map((elemento)=>{elemento.dias.map((dia)=>{dict={"dia":dia, "horaInicio":elemento.horaInicio, "horaFinal":elemento.horaFin} 
  
  Lista.push(dict)})})
  //Verifica que dos o mas disponibilidades no esten solapadas en los horarios 
 for (var i=0; i<Lista.length; i++) { 
  for (var j=i+1; j<Lista.length;j++) { 
    if (Lista[i].dia==Lista[j].dia) { 
      if (Lista[j].horaI>=Lista[i].horaI && Lista[j].horaI<Lista[i].horaF) { 
        throw new BadRequestError("Error en el registro de disponibilidades. Intente de nuevo")
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
      return toModel(cancha);
    }
  } catch {
    throw new InternalServerError(errorMsg);
  }
  throw new NotFoundError(notFoundMsg);
}