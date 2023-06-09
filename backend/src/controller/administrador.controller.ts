import {Request, Response} from 'express' 
import { PrismaClient } from '@prisma/client'
import {number, z, ZodError} from 'Zod'

const prisma=new PrismaClient()

export const postAdministrador= async (req:Request, res:Response) => { 
   const post_administrador = await prisma.administrador.create({ 
    data: { 
        "nombre":req.body['nombre'].toLowerCase(),
        "nombreusuario":req.body['nombreusuario'].toLowerCase(), 
        "apellido":req.body['apellido'].toLowerCase(),
        "correo":req.body['correo'].toLowerCase(), 
        "telefono":req.body['telefono'].toLowerCase(), 
        "clave":req.body['clave'].toLowerCase(),
        "suscripcion": { 
            create: { 
                "nombre":String(req.query['name']).toLowerCase()
            },
        },
        "tarjeta": {  
            create: { 
                "nombre":req.body['nombre'].toLowerCase(), 
                "numero": req.body['numero'], 
                "cvv":req.body['cvv'], 
                "fechavencimiento":req.body['fechavencimiento']
            },
        },
    },
   })
    console.log(post_administrador)
    return res.json(post_administrador)
}

export const getAllAdministrador = async (req:Request, res:Response) => { 
    
    try { 
        const get_administrador=await prisma.administrador.findMany({ 
           
           select: { 
            "idadministrador":true,
            "nombre":true, 
            "nombreusuario":true, 
            "apellido": true, 
            "clave":true, 
            "telefono":true, 
            "correo":true, 
            "suscripcion":true, 
            "tarjeta":true
           },
        }) 
        return res.status(200).json(get_administrador)
    }catch(error) 
    { 
        return res.status(500).json({"messages":"Hubo un error"})
    } 
    
}

export const getAdministradorByNombre = async (req:Request, res:Response) => { 
    try { 
        const getAdministradorNombre = await prisma.administrador.findMany({ 
            where: { 
                "nombre":String(req.params['nombre'])
            },
        })

        return res.status(200).json(getAdministradorNombre)
    

    }catch(error) { 
        return res.status(500).json({"messages":"Hubo un error"})
    }
    
}