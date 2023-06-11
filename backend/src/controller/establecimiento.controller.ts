import {Request, Response} from 'express' 
import { PrismaClient } from '@prisma/client'
import {z, ZodError} from 'Zod'
const path=require('path')
const cloudinary=require('cloudinary')

const prisma=new PrismaClient() 
cloudinary.config({ 
    cloud_name: 'dlyqi5ko6', 
    api_key: '798868126356395', 
    api_secret: 'n7hRWH7DrYaytTlmM1dgHBK7DgM' 
  });

export const postEstablecimiento = async (req:any, res:Response)=> {
   
    try { 
   
       const idadministrador=req.query.id
       
       const administrador=await prisma.administrador.findFirst({ 
        where: { 
            idadministrador:Number(idadministrador)
        }
       }) 

       if (administrador) { 
        const result= await cloudinary.v2.uploader.upload(req.file.path)
        const diasemana= await prisma.diasdesemana.create({ 
        data: { 
            diasemana:String(req.body.diasdesemana)
        }
       })
       
       const horariosdeatencion= await prisma.horariosdeatencion.create({ 
        data: { 
            horaapertura:new Date(String(req.body.horaapertura)), 
            horacierre:new Date(String(req.body.horacierre)), 
            diasemana:String(diasemana.diasemana)
        }
       }) 
        const establecimiento = await prisma.establecimiento.create({ 
            data: { 
                nombre: req.body.nombre, 
                telefono:req.body.telefono, 
                direccion:req.body.direccion, 
                email:req.body.email, 
                urlimagen:result.url, 
                localidad:req.body.localidad, 
                provincia:req.body.provincia, 
                idadministrador:administrador.idadministrador, 
                idhorariosdeatencion:horariosdeatencion.idhorariosatencion
            }
        })
        return res.status(200).json(establecimiento)
       }else { 
        return res.status(500).json({"messages": "El administrador no existe intente crear un administrador"})
       }
       
    
    
    }catch(error){ 
        console.log(error)
    }
   
    
    

}