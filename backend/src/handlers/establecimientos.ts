import { RequestHandler } from "express";
import { EstablecimientoService } from "../services/establecimientos.js";
import { Establecimiento } from "../models/establecimiento.js";
import { PrismaClient } from "@prisma/client";
import { getSuscripcionByAdminID } from "../repositories/administrador.js";


const prisma = new PrismaClient();
export class EstablecimientoHandler {
  prismaClient = new PrismaClient();
  private service: EstablecimientoService;
  constructor(service: EstablecimientoService) {
    this.service = service;
  }

  crearEstablecimiento(): RequestHandler {
    return async (req, res) => {
      const est: Establecimiento = {
        ...req.body,
        id: 0,
      };
      const imagen = req.file;
      const idSuscripcion = await getSuscripcionByAdminID(est.idAdministrador);

      const cantidad = await getEstablecimientoByID(est.idAdministrador);

      if (
        (idSuscripcion === 1 && cantidad < 1) ||
        (idSuscripcion === 2 && cantidad < 3) ||
        (idSuscripcion === 3 && cantidad < 15)
      ) {
        const estResult = await this.service.crearEstablecimiento(est, imagen);
        estResult.match(
          (est) => res.status(201).json(est),
          (err: any) => res.status(err.status).json(err)
        );
      } else {
        console.log(
          "La suscripcion asignada no le permite cargar mas establecimientos"
        );
      }
    };
  }

  getByAdminID(): RequestHandler {
    return async (req, res) => {
      // TODO: mejorar input validation
      const idAdmin = Number(req.body.idAdmin);
      const estsResult = await this.service.getByAdministradorID(idAdmin);
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
}

export async function getEstablecimientoByID(id: number): Promise<number> {
  const admin = await prisma.establecimiento.findMany({
    where: {
      idAdministrador: Number(id),
    },
  });

  return admin.length;
}

