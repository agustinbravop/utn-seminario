import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import {AdministradorHandler} from '../handlers/administrador'
import { PrismaAdministrador} from '../repositories/administrador'
import {AdministradorServiceImpl} from '../services/administrador'

export function AdministradorRouter(prismaClient:PrismaClient): Router { 
    const router=Router() 

    const repository=new PrismaAdministrador(prismaClient)
    const service=new AdministradorServiceImpl(repository) 
    const handler=new AdministradorHandler(service)

    router.get('/:id', handler.getAdministradorById())

    return router 

}
