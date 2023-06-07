import {Request, Response} from 'express' 
import { PrismaClient } from '@prisma/client'
import {z, ZodError} from 'Zod'

const prisma=new PrismaClient()

export const getSuscripcion = async (req: Request, res:Response) => { 
    try { 
        const suscripciones_all=await prisma.suscripcion.findMany()
        return res.status(200).json(suscripciones_all)
    }catch(error) 
    { 
        return res.status(500).json(error)
    }
}

export const postSuscripcion = async (req: Request, res:Response) => { 
    const suscripcionSchema=z.object({ 

        nombre:z.string().nonempty(), 
        limiteestablecimiento:z.number(), 
        costomensual:z.number()

    })
   

    try { 
        suscripcionSchema.parse(req.body) 
        const suscripcion =await prisma.suscripcion.create({ 
            data: { 
                
                "nombre": req.body['nombre'], 
                "limiteestablecimiento":req.body['limiteestablecimiento'], 
                "costomensual":req.body['costomensual']
            }
        }) 
       
        return res.status(201).json(suscripcion) 

       

    }catch (error) 
    { 
      if (error instanceof ZodError) { 
        return res.status(500).json(error.issues)
      }
       
    }

}