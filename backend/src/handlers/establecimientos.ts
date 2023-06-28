import { RequestHandler } from "express";
import { EstablecimientoService } from "../services/establecimientos.js";
import { Establecimiento } from "../models/establecimiento.js";
import { z } from "zod";

export const crearEstablecimientoReqSchema = z.object({
  nombre: z.string().nonempty(),
  correo: z.string().nonempty().email(),
  telefono: z.string().nonempty().max(15),
  direccion: z.string().nonempty(),
  localidad: z.string().nonempty(),
  provincia: z.string().nonempty(),
  imagen: z.custom<Express.Multer.File>().optional(),
  idAdministrador: z.string().transform((idAdm) => Number(idAdm)),
  horariosDeAtencion: z.string().nonempty().nullable(),
});

export class EstablecimientoHandler {
  private service: EstablecimientoService;
  constructor(service: EstablecimientoService) {
    this.service = service;
  }

  crearEstablecimiento(): RequestHandler {
    return async (req, res) => {
      const est: Establecimiento = {
        ...res.locals.body,
        id: 0,
      };
      const imagen = req.file;

      const estResult = await this.service.crearEstablecimiento(est, imagen);
      estResult.match(
        (est) => res.status(201).json(est),
        (err: any) => res.status(err.status).json(err)
      );
    };
  }

  getByAdminID(): RequestHandler {
    return async (req, res) => {
      // TODO: mejorar input validation
      const idAdmin = Number(req.params.idAdmin);
      const estsResult = await this.service.getAllByAdminID(idAdmin);
      estsResult.match(
        (ests) => res.status(200).json(ests),
        (err: any) => res.status(err.status).json(err)
      );
    };
  }

  getEstablecimientoByAdminID():RequestHandler { 
    return async (req, res) => { 
      const idAdmin=Number(req.params['idAdmin']) 
      const estResult=await this.service.getEstablecimientoByAdminID(idAdmin) 
      estResult.match( 
        (est)=> res.status(200).json(est), 
        (err)=>res.status(err.status).json(err)
      )
    }
  }

  getEstablecimientoByIDByAdminID(): RequestHandler{ 
    return async(req, res)=> { 
      const idAdmin=Number(req.params['idAdmin'] )
      const idEst=Number(req.params['id'] )
      const estResul=await this.service.getEstablecimientoByIDByAdminID(idAdmin, idEst)

      estResul.match( 
        (est)=>res.status(200).json(est), 
        (err)=>res.status(err.status).json(err)
      )
    }
  }

  putEstablecimientoByAdminIDByID():RequestHandler{ 
    return async (req, res)=> { 
      const est: Establecimiento= { 
        ...req.body
      }
      const imagen= req.file 
      const idEst=Number(req.params['id'])

      const estResul=await this.service.putEstablecimientoByAdminIDByID(est,idEst,imagen); 
      estResul.match( 
        (est)=>res.status(200).json(est), 
        (err)=>res.status(err.status).json(err)
      )
      
    }
  }
}
