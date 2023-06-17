import { PrismaClient, establecimiento } from "@prisma/client";
import { ApiError } from "../utils/apierrors.js";
import { Result, err, ok } from "neverthrow";
import { Establecimiento } from "../models/establecimiento.js";


export interface EstablecimientoRepository {
  crearEstablecimiento(
    est: Establecimiento
  ): Promise<Result<Establecimiento, ApiError>>;
  getByAdministradorID(
    idAdmin: number
  ): Promise<Result<Establecimiento[], ApiError>>;
}

export class PrismaEstablecimientoRepository
  implements EstablecimientoRepository
{
  private prisma: PrismaClient;

  constructor(client: PrismaClient) {
    this.prisma = client;
  }

  private toModel(est: establecimiento): Establecimiento {
    return { ...est };
  }

  async crearEstablecimiento(
    est: Establecimiento
  ): Promise<Result<Establecimiento, ApiError>> {
    try {
      const dbEst = await this.prisma.establecimiento.create({
        data: {
          id: undefined,
          nombre: est.nombre,
          telefono: est.telefono,
          correo: est.correo,
          direccion: est.direccion,
          localidad: est.localidad,
          provincia: est.provincia,
          idAdministrador: Number(est.idAdministrador),
          urlImagen: est.urlImagen,
          horariosDeAtencion: est.horariosDeAtencion,
        },
      });
      return ok(this.toModel(dbEst));
    } catch (e) {
      console.log(e)
      return err(new ApiError(500, "No se pudo registrar el establecimiento, el Administrador Ingresado no existe"));
    }
  }

  async getByAdministradorID(
    idAdmin: number
  ): Promise<Result<Establecimiento[], ApiError>> {
    try { 
      const dbEsts = await this.prisma.establecimiento.findMany({
        where: {
          idAdministrador: idAdmin,
        },
      });

      const establecimientos = dbEsts.map((dbEsts) => this.toModel(dbEsts));
      
      return ok(establecimientos);
    } catch (e) {
      return err(new ApiError(500, "No se pudo obtener los establecimientos"));
    }
  } 

}
