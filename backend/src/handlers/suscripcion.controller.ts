import {Request, Response} from 'express' 
import { PrismaClient } from '@prisma/client'
import {z, ZodError} from 'Zod'

const prisma=new PrismaClient()
// muestra las suscripciones todas
export const getSuscripcion = async (req: Request, res:Response) => { 
    try { 
        const suscripciones_all=await prisma.suscripcion.findMany()
        return res.status(200).json(suscripciones_all)
    }catch(error) 
    { 
        return res.status(500).json(error)
    }
}
//Buscar suscripcion por ID
export const getSuscripcionbyId= async (req:Request, res:Response)=> { 
    const suscripcionId = Number(req.params.id)
    const suscripcion = await prisma.suscripcion.findFirst({ 
        where: { 
            idsuscripcion: suscripcionId
        }, 
    })
    if (suscripcion) { 
        return res.status(200).json(suscripcion)
    }else { 
        return res.status(404).json({"valor":suscripcionId, "messages": "El valor ingresado es incorrecto"})
    }
}

//crea una suscripcion sin parametro
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

//se crea un suscripcion de un Tipo Standar | Premium |Enterprise pasandole el parametro del nombre de la suscripcion
export const postSuscripcionTipo = async (req:Request, res:Response) => { 
    const nombreParams=String(req.params.nombre) 
    const suscripcion= await prisma.suscripcion.findFirst({ 
        where: { 'nombre':nombreParams},
    })
    if (suscripcion) { 
        return res.json({"valor": nombreParams, "messages": "El valor ingresado ya existe"})
    }else 
    { 
        const suscripcionSchema=z.object({ 
            limiteestablecimiento:z.number(), 
            costomensual:z.number()
    
        })
        const newData= { 
            "limiteestablecimiento":req.body['limiteestablecimiento'], 
            "costomensual":req.body['costomensual']
        }

        try { 
            suscripcionSchema.parse(newData) 
            const suscripcion = await prisma.suscripcion.create({ 
                data: { 
                    "nombre":nombreParams, 
                    "limiteestablecimiento":req.body['limiteestablecimiento'], 
                    "costomensual":req.body['costomensual']
                }
            })
            return res.status(201).json(suscripcion)

        }catch(error) { 
            if (error instanceof ZodError) { 
                return res.status(500).json(error.issues)
              }
        }
    }
}
