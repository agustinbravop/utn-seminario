import { EstablecimientoRepository } from "../repositories/establecimientos.js";
import { Establecimiento } from "../models/establecimiento.js";
import { ConflictError, InternalServerError } from "../utils/apierrors.js";
import { subirImagen } from "../utils/imagenes.js";
import { AdministradorService } from "./administrador.js";

export interface EstablecimientoService {
  crear(
    establecimiento: Establecimiento,
    imagen?: Express.Multer.File
  ): Promise<Establecimiento>;
  getByAdminID(idAdmin: number): Promise<Establecimiento[]>;
  getByID(idEst: number): Promise<Establecimiento>;
  modificar(
    est: Establecimiento,
    imagen?: Express.Multer.File
  ): Promise<Establecimiento>;
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

  async getByID(idEst: number): Promise<Establecimiento> {
    return await this.repo.getByID(idEst);
  }

  async getByAdminID(idAdmin: number): Promise<Establecimiento[]> {
    return await this.repo.getByAdminID(idAdmin);
  }

  async crear(
    est: Establecimiento,
    imagen?: Express.Multer.File
  ): Promise<Establecimiento> {
    await this.validarLimiteEstablecimientos(est.idAdministrador);

    let urlImagen = null;
    if (imagen) {
      try {
        urlImagen = await subirImagen(imagen);
      } catch (e) {
        console.error(e);
        throw new InternalServerError("Error al subir la imagen");
      }
    }
    est.urlImagen = urlImagen;

    return await this.repo.crear(est);
  }

  async modificar(
    est: Establecimiento,
    imagen?: Express.Multer.File
  ): Promise<Establecimiento> {
    if (imagen) {
      try {
        est.urlImagen = await subirImagen(imagen);
      } catch (e) {
        console.error(e);
        throw new InternalServerError("Error al actualizar la imagen");
      }
    }

    return await this.repo.modificar(est);
  }

  async validarLimiteEstablecimientos(idAdmin: number): Promise<void> {
    const admin = await this.adminService.getAdministradorByID(idAdmin);

    const ests = await this.repo.getByAdminID(admin.id);

    if (admin.suscripcion.limiteEstablecimientos <= ests.length) {
      throw new ConflictError("Limite de establecimientos alcanzado");
    }
  }
}
