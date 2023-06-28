import { PrismaClient, establecimiento } from "@prisma/client";
import { ApiError } from "../utils/apierrors.js";
import { Result, err, ok } from "neverthrow";
import { Establecimiento } from "../models/establecimiento.js";
import {EnvioCorreo} from '../utils/EnviodeCorreoUpdate.js'


export interface EstablecimientoRepository {
  crearEstablecimiento(
    est: Establecimiento
  ): Promise<Result<Establecimiento, ApiError>>;
<<<<<<< HEAD
  getByAdministradorID(
    idAdmin: number
  ): Promise<Result<Establecimiento[], ApiError>>;
  getEstablecimientoByAdminID(idAdmin:number): Promise<Result<Establecimiento[], ApiError>>; 
  getEstablecimientoByIDByAdminID(idAdmin:number, idEstablecimiento:number):Promise<Result<Establecimiento,ApiError>>;
  putEstablecimientoByAdminIDByID(est:Establecimiento, idEst:number):Promise<Result<Establecimiento,ApiError>>
=======
  getByAdminID(idAdmin: number): Promise<Result<Establecimiento[], ApiError>>;
>>>>>>> 864bc67d86a3944c8a491f418f84937631672d97
}

export class PrismaEstablecimientoRepository
  implements EstablecimientoRepository
{
  private prisma: PrismaClient;

  constructor(client: PrismaClient) {
    this.prisma = client;
  }

  private toModel(est: establecimiento): Establecimiento {
    return { ...est };
  }

  async crearEstablecimiento(
    est: Establecimiento
  ): Promise<Result<Establecimiento, ApiError>> {
    try {
      const dbEst = await this.prisma.establecimiento.create({
        data: {
          id: undefined,
          nombre: est.nombre,
          telefono: est.telefono,
          correo: est.correo,
          direccion: est.direccion,
          localidad: est.localidad,
          provincia: est.provincia,
          idAdministrador: Number(est.idAdministrador),
          urlImagen: est.urlImagen,
          horariosDeAtencion: est.horariosDeAtencion,
        },
      });
      return ok(this.toModel(dbEst));
    } catch (e) {
      console.error(e);
      return err(new ApiError(500, "No se pudo crear el establecimiento"));
    }
  }

  async getByAdminID(
    idAdmin: number
  ): Promise<Result<Establecimiento[], ApiError>> {
    try {
      const dbEsts = await this.prisma.establecimiento.findMany({
        where: {
          idAdministrador: idAdmin,
        },
      });

      const establecimientos = dbEsts.map((dbEsts) => this.toModel(dbEsts));

      return ok(establecimientos);
    } catch (e) {
<<<<<<< HEAD
     
=======
      console.error(e);
>>>>>>> 864bc67d86a3944c8a491f418f84937631672d97
      return err(new ApiError(500, "No se pudo obtener los establecimientos"));
    }
  }

  async getEstablecimientoByAdminID(idAdmin: number): Promise<Result<Establecimiento[], ApiError>> {
  
      try { 
        const establecimiento= await this.prisma.establecimiento.findMany({ 
          where: { 
            idAdministrador:idAdmin
          }
        })
        if (establecimiento.length===0) { 
        return err(new ApiError(500, "Error, El ID "+idAdmin+" del administrador ingresado no existe. Intente nuevamente"))
        }
        return ok(establecimiento)   
      }catch(e) { 
        return err(new ApiError(500, "Error, El ID ingresado no existe. Intente de nuevo"))
      }
  }

 async getEstablecimientoByIDByAdminID(idAdmin: number, idEstablecimiento: number): Promise<Result<Establecimiento, ApiError>> {
      try {
        const establecimiento=await this.prisma.establecimiento.findFirstOrThrow({ 
          where: { 
            AND: [ 
              {
                id:idEstablecimiento
              }, 
              {
                idAdministrador:idAdmin
              }
            ]
          }
        }); 

        return ok(establecimiento)

      }catch(e) { 
       
        
        return err(new ApiError(500, "Error no se encuentra el establecimiento con los datos ingresados. Intente de nuevo"))
      }
  }


  async putEstablecimientoByAdminIDByID(est: Establecimiento, idEst:number): Promise<Result<Establecimiento, ApiError>> {
      try {
        
        const ests=await this.prisma.establecimiento.update({ 
          where: { 
            id:idEst
          },
          data: { 
            nombre:est.nombre, 
            telefono: est.telefono,
            correo: est.correo,
            direccion: est.direccion,
            localidad: est.localidad,
            provincia: est.provincia,
            urlImagen: est.urlImagen,
            horariosDeAtencion: est.horariosDeAtencion,
          },
        })

       EnvioCorreo(ests)
        
        return ok(this.toModel(ests))
         
      }catch(e){ 
      
        return err(new ApiError(500, "Error no se pudo actualizar el establecimiento "))
      }
  }
}
