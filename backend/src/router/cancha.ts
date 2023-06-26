import express from "express";
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaCanchaRepository } from "../repositories/cancha";
import { CanchaServiceimpl } from "../services/cancha";
import { CanchaHandler } from "../handlers/cancha";
import multer from "multer";


export function CanchaRouter(prismaClient:PrismaClient):Router { 
    const router=express.Router()

    const repository=new PrismaCanchaRepository(prismaClient)
    const service=new CanchaServiceimpl(repository)
    const handler=new CanchaHandler(service) 
    const upload = multer({ dest: "imagenes/" });

    router.get('/establecimiento/:id', handler.getCanchaByEstablecimientoByID()); 
    router.get('/:id_cancha', handler.getCanchaByID()); 
    router.post('/establecimiento/:id',upload.single('imagen'), handler.crearCancha())

    return router 
}