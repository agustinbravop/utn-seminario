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

    getCanchaAllByEstablecimientoByID(): RequestHandler { 
        return async (req, res)=> { 
            const idEst=Number(req.params['idEst']) 
            const cancha=await this.service.getCanchaAllByEstablecimientoByID(idEst); 
            cancha.match(
                (canchas)=>res.status(200).json(canchas), 
                (err)=>res.status(err.status).json(err)
            )
        }
    }

    putCanchaByIDBEstablecimiento():RequestHandler { 
        return async (req, res)=> { 
            const cancha: Cancha= { 
                ...req.body 
            }
           
            const imagen=req.file
            const id_cancha=Number(req.params['idCancha'])
            const idEst=Number(req.params['idEst'])
            const canchaActualizada=await this.service.putCanchaByIDByEstablecimiento(cancha, id_cancha,idEst,imagen)

            canchaActualizada.match( 
                (canchaAct)=>res.status(200).json(canchaAct), 
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
           const idEst=Number(req.params['idEst'])
           const cancha_post=await this.service.crearCancha(cancha,idEst,imagen); 
           cancha_post.match( 
            (cancha_post)=>res.status(200).json(cancha_post), 
            (err)=>res.status(err.status).json(err)
           )
        }
    }
}