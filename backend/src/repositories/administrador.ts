import {  PrismaClient} from "@prisma/client";
import { ApiError } from "../utils/apierrors.js";
import { Result, err, ok } from "neverthrow";

const prisma=new PrismaClient()

export interface AdministradorRepository { 
    getAdministradorByID(id:number):Promise<Result<Number,ApiError>>
}

export class PrismaAdministrador implements AdministradorRepository { 
    private prisma:PrismaClient 

    constructor(client:PrismaClient) { 
        this.prisma=client 
    }

    async getAdministradorByID(id:number) : Promise<Result<Number,ApiError>> { 
        try { 
            const dbAdmin =await this.prisma.administrador.findUniqueOrThrow({ 
                where: { 
                    id:id, 
                    
                },
                select: { 
                    idSuscripcion:true
                }
            }); 
            return ok(dbAdmin.idSuscripcion)
           
           
        }catch(e) { 
            return err(new ApiError(500, "El Administrador Buscado no existe"))
        }
    }

 
}

export async function getSuscripcionByAdminID(id:number):Promise<number|undefined> { 
    const admin=await prisma.administrador.findFirst({ 
        where: { 
            id:Number(id)
        }, 
        select: { 
            idSuscripcion:true
        }
    }); 
    return (admin?.idSuscripcion)    
}

