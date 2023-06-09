import {Request, Response} from 'express' 
import { PrismaClient } from '@prisma/client'
import {number, z, ZodError} from 'Zod'
import dayjs from 'dayjs'
import * as momemnt from 'moment'
const moment = require('moment');




const prisma=new PrismaClient() 
// Lista todas las tarjetas 
export const getAllTarjeta = async (req:Request, res:Response) => { 
    try { 
        const tarjeta_all=await prisma.tarjeta.findMany() 
        return res.status(200).json(tarjeta_all)
    }catch(error) { 
        return res.status(500).json(error)
    }
   
}

export const getTarjetaById = async (req:Request, res:Response) => { 
   
    try { 
        const tarjeta_id=Number(req.params.id) 
         const tarjetById = await prisma.tarjeta.findFirst({ 
        where: { 
            idtarjeta:tarjeta_id
        }, 
    })

    if (tarjetById) { 
        return res.status(200).json(tarjetById)
    }else { 
        return res.status(404).json({ "valor":tarjeta_id, "messages":"El valor ingresado no existe. Ingrese nuevamente otro valor"})
    }

    }catch(error) { 

       return res.status(500).json({"messages": "Hubo un error Intente nuevamente."})
    }
    
}

export const getTarjetaByName = async (req:Request, res:Response) => { 
    const tarjeta_name=String(req.params.nombre)
    
    const tarjetaByName = await prisma.tarjeta.findFirst({ 
        where : { 
            "nombre": tarjeta_name.toLowerCase()
        }, 
    })

    if (tarjetaByName){ 
        return res.status(200).json(tarjetaByName)
    }else { 
        return res.status(404).json({"valor":req.params.nombre, "messages": "El valor ingresado no existe. Intente nuevamente otro valor"})
    }

}

export const postTarjeta = async (req:Request, res:Response) => { 
    const tarjetaSchema=z.object({ 
        nombre:z.string().nonempty(),
        numero:z.number(), 
        cvv:z.number(), 
        fechavencimiento:z.string().nonempty()
    })
    
    const data= { 
        "nombre":req.body['nombre'],
        "numero":req.body['numero'], 
        "cvv":req.body['cvv'],
        "fechavencimiento":req.body['fechavencimiento']
        
    }
    try { 
        tarjetaSchema.parse(data) 
        const fecha = moment(req.body['fechavencimiento'], 'DD/MM/YYYY',true).isValid();
        if (fecha==true) { 
            const tarjeta= await prisma.tarjeta.createMany({ 
                data: { 
                    "nombre": req.body['nombre'].toLowerCase(), 
                    "numero": req.body['numero'], 
                    "cvv": req.body['cvv'], 
                    "fechavencimiento":new Date(req.body['fechavencimiento'])
                }
            })
        
            return res.status(201).json({"messages":"Registro guardado con exito", "cantidad de Registro":tarjeta})
    

        }else { 
            return res.status(500).json({"messages":"La fecha ingresada es incorrecta"})
        }
           
    }catch (error) { 
        if (error instanceof ZodError) { 
            return res.status(500).json(error.issues)
          }
    } 

}