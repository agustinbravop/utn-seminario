import { EstablecimientoRepository } from "../repositories/establecimientos.js";
import { Result, err } from "neverthrow";
import { Establecimiento } from "../models/establecimiento.js";
import { ApiError } from "../utils/apierrors.js";
import { subirImagen } from "../utils/imagenes.js";

export interface EstablecimientoService {
  crearEstablecimiento(
    establecimiento: Establecimiento,
    imagen?: Express.Multer.File
  ): Promise<Result<Establecimiento, ApiError>>;
  getByAdministradorID(
    idAdmin: number
  ): Promise<Result<Establecimiento[], ApiError>>;
}

export class EstablecimientoServiceImpl implements EstablecimientoService {
  private repo: EstablecimientoRepository;

  constructor(repository: EstablecimientoRepository) {
    this.repo = repository;
  }
  
  async getByAdministradorID(
    idAdmin: number
  ): Promise<Result<Establecimiento[], ApiError>> {
    return await this.repo.getByAdministradorID(idAdmin);
  }

  async crearEstablecimiento(
    establecimiento: Establecimiento,
    imagen?: Express.Multer.File
  ): Promise<Result<Establecimiento, ApiError>> {
    let urlImagen = null;
    if (imagen) {
      try {
        urlImagen = await subirImagen(imagen);
      } catch (e) {
        return err(new ApiError(500, "Error al subir la imagen"));
      }
    }
    establecimiento.urlImagen = urlImagen;

    return await this.repo.crearEstablecimiento(establecimiento);
  }
}
