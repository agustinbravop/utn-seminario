import { PrismaClient, establecimiento } from "@prisma/client";
import { ApiError } from "../utils/apierrors.js";
import { Result, err, ok } from "neverthrow";
import { Establecimiento } from "../models/establecimiento.js";

export interface EstablecimientoRepository {
  crear(est: Establecimiento): Promise<Result<Establecimiento, ApiError>>;
  getByAdminID(idAdmin: number): Promise<Result<Establecimiento[], ApiError>>;
  getByID(
    idEstablecimiento: number
  ): Promise<Result<Establecimiento, ApiError>>;
  modificar(est: Establecimiento): Promise<Result<Establecimiento, ApiError>>;
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

  async crear(
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
          idAdministrador: est.idAdministrador,
          urlImagen: est.urlImagen,
          horariosDeAtencion: est.horariosDeAtencion,
        },
      });
      return ok(this.toModel(dbEst));
    } catch (e) {
      console.error(e);
      return err(new ApiError(500, "No se pudo crear el establecimiento"));
    }
  }

  async getByID(idEst: number): Promise<Result<Establecimiento, ApiError>> {
    return awaitQuery(
      this.prisma.establecimiento.findUnique({
        where: {
          id: idEst,
        },
      }),
      `No existe establecimiento con id ${idEst}`,
      "Error al intentar obtener el establecimiento"
    );
  }

  async getByAdminID(
    idAdmin: number
  ): Promise<Result<Establecimiento[], ApiError>> {
    try {
      const estsDB = await this.prisma.establecimiento.findMany({
        where: { idAdministrador: idAdmin },
      });

      return ok(estsDB.map((estDB) => this.toModel(estDB)));
    } catch (e) {
      return err(new ApiError(500, "No se pudo obtener los establecimientos"));
    }
  }

  async modificar(
    est: Establecimiento
  ): Promise<Result<Establecimiento, ApiError>> {
    return awaitQuery(
      this.prisma.establecimiento.update({
        where: {
          id: est.id,
        },
        data: {
          ...est,
          id: undefined,
        },
      }),
      `No existe establecimiento con id ${est.id}`,
      "Error al intentar modificar el establecimiento"
    );
  }
}

type establecimientoDB = establecimiento;

function toModel(est: establecimientoDB): Establecimiento {
  return { ...est };
}

async function awaitQuery(
  promise: Promise<establecimientoDB | null>,
  notFoundMsg: string,
  errorMsg: string
): Promise<Result<Establecimiento, ApiError>> {
  try {
    const estDB = await promise;

    if (estDB === null) {
      return err(new ApiError(404, notFoundMsg));
    }
    return ok(toModel(estDB));
  } catch (e) {
    return err(new ApiError(500, errorMsg));
  }
}
