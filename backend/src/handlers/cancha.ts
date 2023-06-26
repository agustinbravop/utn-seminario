import { CanchaService } from "../services/cancha";
import { RequestHandler } from "express";

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
}