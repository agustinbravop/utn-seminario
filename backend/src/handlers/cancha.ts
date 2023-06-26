import { CanchaService } from "../services/cancha";
import { RequestHandler } from "express";
import { Cancha } from "../models/cancha";

export class CanchaHandler { 
    private service:CanchaService

    constructor(service:CanchaService) { 
        this.service=service
    }

    getCanchaByEstablecimientoByID():RequestHandler { 
        return async (req, res)=> { 
            const idEst=Number(req.params['id'])

            const cancha=await this.service.getCanchaByEstablecimientoByID(idEst); 

            cancha.match( 
                (cancha)=>res.status(200).json(cancha), 
                (err)=>res.status(err.status).json(err)
            )
        }
    }

    getCanchaByID():RequestHandler { 
        return async (req, res)=> { 
            const idCancha=Number(req.params['id_cancha']); 

            const cancha=await this.service.getCanchaByID(idCancha); 

            cancha.match( 
                (cancha)=>res.status(200).json(cancha), 
                (err)=>res.status(err.status).json(err)
            )
        }
    }

    crearCancha(): RequestHandler { 
        return async (req, res)=> { 
           const cancha: Cancha= { 
            ...req.body

           }
           
           const imagen=req.file; 
           const idEst=Number(req.params['id'])
           const cancha_post=await this.service.crearCancha(cancha,idEst,imagen); 
           cancha_post.match( 
            (cancha_post)=>res.status(200).json(cancha_post), 
            (err)=>res.status(err.status).json(err)
           )
        }
    }
}