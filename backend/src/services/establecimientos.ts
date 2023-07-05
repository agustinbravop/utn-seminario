import { EstablecimientoRepository } from "../repositories/establecimientos.js";
import { Result, err } from "neverthrow";
import { Establecimiento } from "../models/establecimiento.js";
import { ApiError } from "../utils/apierrors.js";
import { subirImagen } from "../utils/imagenes.js";
import { AdministradorService } from "./administrador.js";

export interface EstablecimientoService {
  crear(
    establecimiento: Establecimiento,
    imagen?: Express.Multer.File
  ): Promise<Result<Establecimiento, ApiError>>;
  getByAdminID(idAdmin: number): Promise<Result<Establecimiento[], ApiError>>;
  getByID(idEst: number): Promise<Result<Establecimiento, ApiError>>;
  modificar(
    est: Establecimiento,
    imagen?: Express.Multer.File
  ): Promise<Result<Establecimiento, ApiError>>;
}

export class EstablecimientoServiceImpl implements EstablecimientoService {
  private repo: EstablecimientoRepository;
  private adminService: AdministradorService;

  constructor(
    repo: EstablecimientoRepository,
    adminService: AdministradorService
  ) {
    this.repo = repo;
    this.adminService = adminService;
  }

  async getByID(idEst: number): Promise<Result<Establecimiento, ApiError>> {
    return await this.repo.getByID(idEst);
  }

  async getByAdminID(
    idAdmin: number
  ): Promise<Result<Establecimiento[], ApiError>> {
    return await this.repo.getByAdminID(idAdmin);
  }

  async crear(
    est: Establecimiento,
    imagen?: Express.Multer.File
  ): Promise<Result<Establecimiento, ApiError>> {
    const validacionErr = await this.validarLimiteEstablecimientos(
      est.idAdministrador
    );
    if (validacionErr) {
      return err(validacionErr);
    }

    let urlImagen = null;
    if (imagen) {
      try {
        urlImagen = await subirImagen(imagen);
      } catch (e) {
        console.error(e);

        return err(new ApiError(500, "Error al subir la imagen"));
      }
    }
    est.urlImagen = urlImagen;

    return await this.repo.crear(est);
  }

  async modificar(
    est: Establecimiento,
    imagen?: Express.Multer.File
  ): Promise<Result<Establecimiento, ApiError>> {
    if (imagen) {
      try {
        est.urlImagen = await subirImagen(imagen);
      } catch (e) {
        console.error(e);
        return err(new ApiError(500, "Error al actualizar la imagen"));
      }
    }

    return await this.repo.modificar(est);
  }

  async validarLimiteEstablecimientos(
    idAdmin: number
  ): Promise<ApiError | null> {
    const adminRes = await this.adminService.getAdministradorByID(idAdmin);
    const admin = adminRes.unwrapOr(null);
    if (!admin) {
      return adminRes._unsafeUnwrapErr();
    }

    const adminEstsRes = await this.repo.getByAdminID(admin.id);
    const adminEsts = adminEstsRes.unwrapOr(null);
    if (!adminEsts) {
      return adminEstsRes._unsafeUnwrapErr();
    }

    if (admin.suscripcion.limiteEstablecimientos === adminEsts.length) {
      return new ApiError(409, "Limite de establecimientos alcanzado");
    }
    return null;
  }
}
