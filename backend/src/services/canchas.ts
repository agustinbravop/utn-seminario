import { Cancha } from "../models/cancha.js";
import { BadRequestError, InternalServerError } from "../utils/apierrors.js";
import { CanchaRepository } from "../repositories/canchas.js";
import { subirImagen } from "../utils/imagenes.js";

export interface CanchaService {
  getByEstablecimientoID(idEst: number): Promise<Cancha[]>;
  getByID(idCancha: number): Promise<Cancha>;
  crear(cancha: Cancha): Promise<Cancha>;
  modificar(cancha: Cancha): Promise<Cancha>;
  modificarImagen(
    idCancha: number,
    imagen?: Express.Multer.File
  ): Promise<Cancha>;
  eliminar(idCancha: number): Promise<Cancha>;
}

export class CanchaServiceimpl implements CanchaService {
  private repo: CanchaRepository;

  constructor(repository: CanchaRepository) {
    this.repo = repository;
  }

  async getByEstablecimientoID(idEst: number) {
    return await this.repo.getCanchasByEstablecimientoID(idEst);
  }

  async getByID(idCancha: number) {
    return await this.repo.getCanchaByID(idCancha);
  }

  async crear(cancha: Cancha) {
    return await this.repo.crearCancha(cancha);
  }

  async modificar(cancha: Cancha) {
    return await this.repo.modificarCancha(cancha);
  }

  async modificarImagen(idCancha: number, imagen?: Express.Multer.File) {
    const cancha = await this.repo.getCanchaByID(idCancha);

    // Si no se envió una imagen, se considera que se desea eliminar la imagen existente.
    if (!imagen) {
      cancha.urlImagen = null;
      return await this.modificar(cancha);
    }

    if (!imagen.mimetype.startsWith("image/")) {
      throw new BadRequestError(
        "Formato de imagen no soportado: " + imagen.mimetype
      );
    }

    cancha.urlImagen = await subirImagen(
      imagen,
      new InternalServerError("Error al intentar actualizar la imagen")
    );

    return await this.modificar(cancha);
  }

  async eliminar(idCancha: number) {
    return await this.repo.eliminarCancha(idCancha);
  }
}
