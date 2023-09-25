import { Cancha } from "../models/cancha.js";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
} from "../utils/apierrors.js";
import { CanchaRepository } from "../repositories/canchas.js";
import { subirImagen } from "../utils/imagenes.js";

export interface CanchaService {
  getByEstablecimientoID(idEst: number): Promise<Cancha[]>;
  getByID(idCancha: number): Promise<Cancha>;
  crear(cancha: Cancha): Promise<Cancha>;
  modificar(cancha: Cancha): Promise<Cancha>;
  habilitar(idCancha: number, habilitada: boolean): Promise<Cancha>;
  modificarImagen(
    idCancha: number,
    imagen?: Express.Multer.File
  ): Promise<Cancha>;
  eliminar(idCancha: number): Promise<Cancha>;
}

export class CanchaServiceImpl implements CanchaService {
  private repo: CanchaRepository;

  constructor(repository: CanchaRepository) {
    this.repo = repository;
  }

  async getByEstablecimientoID(idEst: number) {
    return await this.repo.getByEstablecimientoID(idEst);
  }

  async getByID(idCancha: number) {
    return await this.repo.getByID(idCancha);
  }

  async crear(cancha: Cancha) {
    return await this.repo.crear(cancha);
  }

  async modificar(cancha: Cancha) {
    return await this.repo.modificar(cancha);
  }

  async modificarImagen(idCancha: number, imagen?: Express.Multer.File) {
    const cancha = await this.repo.getByID(idCancha);

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

  async habilitar(idCancha: number, habilitada: boolean) {
    const cancha = await this.repo.getByID(idCancha);
    if (habilitada === cancha.habilitada) {
      console.log("Coincidencia");

      return cancha;
    }

    if (habilitada) {
      const est = await this.repo.getEstablecimiento(cancha.id);
      console.log(est);

      if (!est.habilitado) {
        throw new ConflictError(
          "No se puede habilitar la cancha de un establecimiento deshabilitado"
        );
      }
    }

    return await this.repo.modificar({ ...cancha, habilitada });
  }

  async eliminar(idCancha: number) {
    return await this.repo.eliminar(idCancha);
  }
}
