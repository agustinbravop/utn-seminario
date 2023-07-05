import { Result, err } from "neverthrow";
import { Cancha } from "../models/cancha.js";
import { ApiError } from "../utils/apierrors.js";
import { CanchaRepository } from "../repositories/canchas.js";
import { subirImagen } from "../utils/imagenes.js";

export interface CanchaService {
  getCanchasByEstablecimientoID(
    idEst: number
  ): Promise<Result<Cancha[], ApiError>>;
  getCanchaByID(idCancha: number): Promise<Result<Cancha, ApiError>>;
  crearCancha(
    cancha: Cancha,
    imagen?: Express.Multer.File
  ): Promise<Result<Cancha, ApiError>>;
  modificarCancha(
    cancha: Cancha,
    imagen?: Express.Multer.File
  ): Promise<Result<Cancha, ApiError>>;
}

export class CanchaServiceimpl implements CanchaService {
  private repo: CanchaRepository;

  constructor(service: CanchaRepository) {
    this.repo = service;
  }

  async getCanchasByEstablecimientoID(
    idEst: number
  ): Promise<Result<Cancha[], ApiError>> {
    return await this.repo.getCanchasByEstablecimientoID(idEst);
  }

  async getCanchaByID(idCancha: number): Promise<Result<Cancha, ApiError>> {
    return await this.repo.getCanchaByID(idCancha);
  }

  async crearCancha(
    cancha: Cancha,
    imagen?: Express.Multer.File
  ): Promise<Result<Cancha, ApiError>> {
    cancha.urlImagen = null;
    if (imagen) {
      try {
        cancha.urlImagen = await subirImagen(imagen);
      } catch (e) {
        return err(new ApiError(500, "Error al subir la imagen"));
      }
    }

    return await this.repo.crearCancha(cancha);
  }

  async modificarCancha(
    cancha: Cancha,
    imagen?: Express.Multer.File
  ): Promise<Result<Cancha, ApiError>> {
    if (imagen && imagen.mimetype.startsWith("image/")) {
      try {
        cancha.urlImagen = await subirImagen(imagen);
      } catch (e) {
        return err(new ApiError(500, "Error al actualizar la imagen"));
      }
    }

    return await this.repo.modificarCancha(cancha);
  }
}
