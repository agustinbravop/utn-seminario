import { PrismaClient, establecimiento, localidad } from "@prisma/client";
import { BadRequestError, InternalServerError, NotFoundError } from "../utils/apierrors.js";
import { Establecimiento } from "../models/establecimiento.js";

export interface EstablecimientoRepository {
  crear(est: Establecimiento): Promise<Establecimiento>;
  getByAdminID(idAdmin: number): Promise<Establecimiento[]>;
  getDeletedByAdminID(idAdmin: number): Promise<Establecimiento[]>;
  getByID(idEstablecimiento: number): Promise<Establecimiento>;
  getEstablecimientoByNombre(NombreEstablecimiento: string):Promise<Establecimiento>; 
  getEstablecimientoByLocalidad(NombreLocalidad:string):Promise<Establecimiento[]>
  getEstablecimientoByProvincia(NombreProvincia:string):Promise<Establecimiento[]>
  getEstablecimientoByLocalidadAndProvincia(NombreLocalidad:string, NombreProvincia:string):Promise<Establecimiento[]>; 
  getEstablecimientoAll():Promise<Establecimiento[]>; 
  getEstablecimientoDisciplina(disciplina:string):Promise<Establecimiento[]>; 
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
      throw new InternalServerError("No se pudo obtener los establecimientos");
    }
  }

  async getDeletedByAdminID(idAdmin: number): Promise<Establecimiento[]> {
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

  async modificar(est: Establecimiento): Promise<Establecimiento> {
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
  async getEstablecimientoDisciplina(disciplina:string):Promise<Establecimiento[]>
  { 
    const disDB=await this.prisma.disponibilidad.findMany({ 
        where: { 
          disciplina:{ 
            disciplina:{ 
              equals:String(disciplina), 
            }, 
          },
        }, 
        include: {
          cancha:{ 
            include:{
              establecimiento:{ 
                include:{ 
                  localidad:true
                }
              }
            }
          }
        }, 
      
    }); 
    
    if (disDB.length==0) { 
      throw new BadRequestError(`No se encontro ningun establecimiento con la disciplina ${disciplina}`)
    }
    const arreglo=new Array()
    disDB.map((dis)=>{arreglo.push(dis.cancha.establecimiento)})
    
    let ests = arreglo.filter((valorActual, indiceActual, arreglo) => {
      
      return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo) === JSON.stringify(valorActual)) === indiceActual
  });
  const dbEst=new Array(); 
  ests.map((c)=>{if (c.eliminado!==true) { 
    dbEst.push(c)
  }}); 
  return dbEst
  
  }

  //Busca los establecimientos por nombre
  async getEstablecimientoByNombre(NombreEstablecimiento:string):Promise<Establecimiento> { 
    try { 
            const establecimiento: establecimientoDB | null=await this.prisma.establecimiento.findFirstOrThrow({ 
              where: { 
                  AND: [
                    {nombre:{
                    equals:String(NombreEstablecimiento), 
                    mode:'insensitive'}}, 
                  {eliminado:false}],
                },
            
              include:this.include, 
            });
            return toModel(establecimiento)
  }catch(e) {
    throw new NotFoundError(`El establecimiento con el nombre ${NombreEstablecimiento} no existe`)
  }
      
}

//Lista todos los establecimientos que no fueron eliminados
async getEstablecimientoAll():Promise<Establecimiento[]> { 
  const estDB=await this.prisma.establecimiento.findMany({
    where: { 
      eliminado:false,
    },
     include:this.include}); 

  return (estDB.map((est)=>toModel(est)))
}

//Busca los establecimientos por localidad
async getEstablecimientoByLocalidad(NombreLocalidad:string):Promise<Establecimiento[]> 
{ 
  var estDB=await this.prisma.establecimiento.findMany({ 
    where: { 
      localidad: { 
        nombre: { 
          equals:String(NombreLocalidad), 
          mode:'insensitive',
        }
      }, 
      eliminado:false,
    }, 
    include:this.include,
  })

  return (estDB.map((est)=>toModel(est))); 

}

//Busca los establecimientos por provincia
async getEstablecimientoByProvincia(NombreProvincia:string):Promise<Establecimiento[]> 
{ 
  var estsDB=await this.prisma.establecimiento.findMany({ 
    where: { 
      localidad: { 
        idProvincia: { 
          equals:String(NombreProvincia), 
          mode:'insensitive',
        },
      },
      eliminado:false, 
    }, 
    include:this.include,   
  }); 
 
 
  return (estsDB.map((est)=>toModel(est))); 
}

//Busca los establecimientos por Localidad y Provincia
async getEstablecimientoByLocalidadAndProvincia(NombreLocalidad:string, NombreProvincia:string):Promise<Establecimiento[]>
{ 
  const estsDB=await this.prisma.establecimiento.findMany({ 
    where: { 
      localidad: { 
        AND:[{nombre:{equals:String(NombreLocalidad)}},
           {idProvincia: { equals:String(NombreProvincia)}}],
      },
      eliminado:false
    },
    include:this.include, 
  } ); 
  return (estsDB.map((ests)=>toModel(ests)))
}
}

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
