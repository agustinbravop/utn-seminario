import { EstablecimientoRepository } from "../repositories/establecimientos.js";
import { Establecimiento } from "../models/establecimiento.js";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
} from "../utils/apierrors.js";
import { subirImagen } from "../utils/imagenes.js";
import { AdministradorService } from "./administrador.js";

export interface EstablecimientoService {
  crear(establecimiento: Establecimiento): Promise<Establecimiento>;
  getDeletedByAdminID(idAdmin: number): Promise<Establecimiento[]>;
  getByAdminID(idAdmin: number): Promise<Establecimiento[]>;
  getByID(idEst: number): Promise<Establecimiento>;
  modificar(est: Establecimiento): Promise<Establecimiento>;
  modificarImagen(
    idEst: number,
    imagen?: Express.Multer.File
  ): Promise<Establecimiento>;
  eliminar(idEst: number): Promise<Establecimiento>;
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

  async getByID(idEst: number) {
    return await this.repo.getByID(idEst);
  }

  async getByAdminID(idAdmin: number) {
    return await this.repo.getByAdminID(idAdmin);
  }

  async getDeletedByAdminID(idAdmin: number) {
    return await this.repo.getDeletedByAdminID(idAdmin);
  }

  async crear(est: Establecimiento) {
    await this.validarLimiteEstablecimientos(est.idAdministrador);

    return await this.repo.crear(est);
  }

  async modificar(est: Establecimiento) {
    return await this.repo.modificar(est);
  }

  async modificarImagen(idEst: number, imagen?: Express.Multer.File) {
    const est = await this.repo.getByID(idEst);

    // Si no se envió una imagen, se considera que se desea eliminar la imagen existente.
    if (!imagen) {
      est.urlImagen = null;
      return await this.modificar(est);
    }

    if (!imagen.mimetype.startsWith("image/")) {
      throw new BadRequestError(
        "Formato de imagen no soportado: " + imagen.mimetype
      );
    }

    est.urlImagen = await subirImagen(
      imagen,
      new InternalServerError("Error al intentar actualizar la imagen")
    );

    return await this.modificar(est);
  }

  private async validarLimiteEstablecimientos(idAdmin: number): Promise<void> {
    const admin = await this.adminService.getByID(idAdmin);

    const ests = await this.repo.getByAdminID(admin.id);

    if (admin.suscripcion.limiteEstablecimientos <= ests.length) {
      throw new ConflictError("Límite de establecimientos alcanzado");
    }
  }

  async eliminar(idEst: number) {
    return await this.repo.eliminar(idEst);
  }
}
