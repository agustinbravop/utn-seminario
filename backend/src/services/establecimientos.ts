import { EstablecimientoRepository } from "../repositories/establecimientos.js";
import { Result, err } from "neverthrow";
import { Establecimiento } from "../models/establecimiento.js";
import { ApiError } from "../utils/apierrors.js";
import { subirImagen } from "../utils/imagenes.js";
import { AdministradorService } from "./administrador.js";

export interface EstablecimientoService {
  crearEstablecimiento(
    establecimiento: Establecimiento,
    imagen?: Express.Multer.File
  ): Promise<Result<Establecimiento, ApiError>>;
  getAllByAdminID(
    idAdmin: number
  ): Promise<Result<Establecimiento[], ApiError>>;
}

export class EstablecimientoServiceImpl implements EstablecimientoService {
  private repo: EstablecimientoRepository;
  private adminService: AdministradorService;

  constructor(
    repository: EstablecimientoRepository,
    adminService: AdministradorService
  ) {
    this.repo = repository;
    this.adminService = adminService;
  }

  async getAllByAdminID(
    idAdmin: number
  ): Promise<Result<Establecimiento[], ApiError>> {
    return await this.repo.getByAdminID(idAdmin);
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

  async crearEstablecimiento(
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
        return err(new ApiError(500, "Error al subir la imagen"));
      }
    }
    est.urlImagen = urlImagen;

    return await this.repo.crearEstablecimiento(est);
  }
}
