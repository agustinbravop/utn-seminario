import express from "express";
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaCanchaRepository } from "../repositories/cancha";
import { CanchaServiceimpl } from "../services/cancha";
import { CanchaHandler } from "../handlers/cancha";

export function CanchaRouter(prismaClient:PrismaClient):Router { 
    const router=express.Router()

    const repository=new PrismaCanchaRepository(prismaClient)
    const service=new CanchaServiceimpl(repository)
    const handler=new CanchaHandler(service) 

    router.get('/establecimiento/:id', handler.getCanchaByEstablecimientoByID())

    return router 
}