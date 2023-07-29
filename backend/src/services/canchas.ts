import { Cancha } from "../models/cancha.js";
import { InternalServerError } from "../utils/apierrors.js";
import { CanchaRepository } from "../repositories/canchas.js";
import { subirImagen } from "../utils/imagenes.js";

export interface CanchaService {
  getCanchasByEstablecimientoID(idEst: number): Promise<Cancha[]>;
  getCanchaByID(idCancha: number): Promise<Cancha>;
  crearCancha(cancha: Cancha, imagen?: Express.Multer.File): Promise<Cancha>;
  modificarCancha(
    cancha: Cancha,
    imagen?: Express.Multer.File
  ): Promise<Cancha>;
}

export class CanchaServiceimpl implements CanchaService {
  private repo: CanchaRepository;

  constructor(service: CanchaRepository) {
    this.repo = service;
  }

  async getCanchasByEstablecimientoID(idEst: number): Promise<Cancha[]> {
    return await this.repo.getCanchasByEstablecimientoID(idEst);
  }

  async getCanchaByID(idCancha: number): Promise<Cancha> {
    return await this.repo.getCanchaByID(idCancha);
  }

  async crearCancha(
    cancha: Cancha,
    imagen?: Express.Multer.File
  ): Promise<Cancha> {
    cancha.urlImagen = null;
    if (imagen) {
      try {
        cancha.urlImagen = await subirImagen(imagen);
      } catch (e) {
        console.error(e);
        throw new InternalServerError("Error al subir la imagen");
      }
    }

    return await this.repo.crearCancha(cancha);
  }

  async modificarCancha(
    cancha: Cancha,
    imagen?: Express.Multer.File
  ): Promise<Cancha> {
    if (imagen && imagen.mimetype.startsWith("image/")) {
      try {
        cancha.urlImagen = await subirImagen(imagen);
      } catch (e) {
        console.error(e);
        throw new InternalServerError("Error al actualizar la imagen");
      }
    }

    return await this.repo.modificarCancha(cancha);
  }
}
