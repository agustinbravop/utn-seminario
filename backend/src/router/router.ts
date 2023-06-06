import {Request, Response} from 'express'
import {Router} from 'express' 
import { Prisma, PrismaClient } from '@prisma/client'
import {z, ZodError} from 'Zod'


const prisma=new PrismaClient()
const router = Router() 

router.post("/suscripcion", async (req: Request, res:Response) => { 

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
    
})

export default router 
