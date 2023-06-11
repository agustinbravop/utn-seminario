import {
  PrismaClient,
  establecimiento,
  horarioDeAtencion,
} from "@prisma/client";
import { ApiError } from "../utils/apierrors.js";
import { Result, err, ok } from "neverthrow";
import {
  Establecimiento,
  HorarioDeAtencion,
} from "../models/establecimiento.js";

export interface EstablecimientoRepository {
  crearEstablecimiento(
    est: Establecimiento
  ): Promise<Result<Establecimiento, ApiError>>;
}

export class PrismaEstablecimientoRepository {
  private prisma: PrismaClient;

  constructor(client: PrismaClient) {
    this.prisma = client;
  }

  private toModel(
    est: establecimiento,
    horarios: horarioDeAtencion[]
  ): Establecimiento {
    const horariosDeAtencion: HorarioDeAtencion[] = horarios.map((h) => ({
      id: h.id,
      horaApertura: h.horaApertura,
      horaCierre: h.horaCierre,
      diaDeSemana: h.idDiaDeSemana,
      idEstablecimiento: h.idEstablecimiento,
    }));

    return { ...est, horariosDeAtencion };
  }

  async crearEstablecimiento(
    est: Establecimiento
  ): Promise<Result<Establecimiento, ApiError>> {
    try {
      const horarios = est.horariosDeAtencion.map((h) => ({
        horaApertura: h.horaApertura,
        horaCierre: h.horaCierre,
        idDiaDeSemana: h.diaDeSemana,
        idEstablecimiento: h.idEstablecimiento,
      }));

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
          horariosDeAtencion: {
            create: horarios,
          },
        },
        include: {
          horariosDeAtencion: true,
        },
      });
      return ok(this.toModel(dbEst, dbEst.horariosDeAtencion));
    } catch (e) {
      return err(new ApiError(500, "No se pudo registrar el establecimiento"));
    }
  }
}
