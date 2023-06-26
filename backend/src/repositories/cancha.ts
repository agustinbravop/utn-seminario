import { Cancha} from '../models/cancha.js';
import { ApiError } from '../utils/apierrors.js'; 
import { Result,ok,err } from 'neverthrow';
import { PrismaClient} from '@prisma/client';

export interface CanchaRepository{ 
    getCanchaByEstablecimientoByID(idEst:number):Promise<Result<Cancha[], ApiError>>; 
    getCanchaByID(idCancha:number): Promise<Result<Cancha, ApiError>>; 
    crearCancha(cancha:Cancha):Promise<Result<Cancha,ApiError>>; 
}

export class PrismaCanchaRepository implements CanchaRepository { 
    private prisma:PrismaClient  

    constructor(prismaClient:PrismaClient) { 
        this.prisma=prismaClient
    }
   

    async getCanchaByEstablecimientoByID(idEst: number): Promise<Result<Cancha[], ApiError>> {
        try { 
            const canchaAll=await this.prisma.cancha.findMany({ 
                where: { 
                    idEstablecimiento:idEst
                }
            }); 
            if (canchaAll.length===0) { 
                return err(new ApiError(200, "No existen canchas por el momento"))
            }
            return ok(canchaAll)
        }catch(e) { 
            return err(new ApiError(500, "Error, no se pudo listar las canchas"))
        }
    }

    async getCanchaByID(idCancha: number): Promise<Result<Cancha, ApiError>> {
        try { 
            const cancha=await this.prisma.cancha.findUniqueOrThrow({ 
                where: { 
                    id:idCancha
                }
            }); 
            return ok(cancha)
        }catch(e) { 
            return err(new ApiError(500, "Error datos ingresado incorrectamente. Intente nuevamente"))
        }
        
    }

    async crearCancha(cancha: Cancha): Promise<Result<Cancha, ApiError>> {
        try { 
            const cancha_post=await this.prisma.cancha.create({ 
                data: { 
                    nombre:cancha.nombre, 
                    descripcion:cancha.descripcion, 
                    estaHabilitada:Boolean(cancha.estaHabilitada), 
                    urlImagen:cancha.urlImagen, 
                    idEstablecimiento:Number(cancha.idEstablecimiento)
                }
            }); 
            return ok(cancha_post)
        }catch(e) { 
            console.log(cancha.urlImagen)
            return err(new ApiError(500, "Error no se pudo cargar la cancha. Intente de nuevo"))
        }
    }
}