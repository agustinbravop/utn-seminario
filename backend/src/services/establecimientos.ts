import { EstablecimientoRepository } from "../repositories/establecimientos.js";
import { Establecimiento } from "../models/establecimiento.js";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
} from "../utils/apierrors.js";
import { subirImagen } from "../utils/imagenes.js";
import { AdministradorService } from "./administrador.js";
import { CanchaService } from "./canchas.js";

export interface EstablecimientoService {
  crear(establecimiento: Establecimiento): Promise<Establecimiento>;
  getDeletedByAdminID(idAdmin: number): Promise<Establecimiento[]>;
  getByAdminID(idAdmin: number): Promise<Establecimiento[]>;
  getByID(idEst: number): Promise<Establecimiento>;
  getConsulta(consulta: Busqueda): Promise<Establecimiento[]>;
  modificar(est: Establecimiento): Promise<Establecimiento>;
  habilitar(idEst: number, habilitado: boolean): Promise<Establecimiento>;
  modificarImagen(
    idEst: number,
    imagen?: Express.Multer.File
  ): Promise<Establecimiento>;
  eliminar(idEst: number): Promise<Establecimiento>;
  getAll(): Promise<Establecimiento[]>;
}

type Busqueda = {
  nombre?: string;
  provincia?: string;
  localidad?: string;
  disciplina?: string;
  fecha?: string;
};

export class EstablecimientoServiceImpl implements EstablecimientoService {
  private repo: EstablecimientoRepository;
  private adminService: AdministradorService;
  private canchaService: CanchaService;

  constructor(
    repository: EstablecimientoRepository,
    adminService: AdministradorService,
    canchaService: CanchaService
  ) {
    this.repo = repository;
    this.adminService = adminService;
    this.canchaService = canchaService;
  }

  async getAll(): Promise<Establecimiento[]> {
    return await this.repo.getAll();
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

  /** Si se deshabilita un establecimiento, se deshabilitan todas sus canchas. */
  async habilitar(idEst: number, habilitado: boolean) {
    const est = await this.repo.getByID(idEst);
    if (habilitado === est.habilitado) {
      return est;
    }

    if (!habilitado) {
      const canchas = await this.canchaService.getByEstablecimientoID(idEst);
      Promise.all(
        canchas.map((c) =>
          this.canchaService.modificar({ ...c, habilitada: false })
        )
      );
    }

    return await this.repo.modificar({ ...est, habilitado });
  }

  async getConsulta(consulta: Busqueda): Promise<Establecimiento[]> {
    console.log(consulta);

    let estabFilter = await this.repo.getEstabsByFiltro(consulta);

    if (consulta.disciplina) {
      const estabDisciplina = await this.repo.getEstablecimientoDisciplina(
        consulta.disciplina
      );
      estabFilter = estabFilter.filter((e) =>
        estabDisciplina.find(({ id }) => id === e.id)
      );
    }

    if (consulta.fecha) {
      const estabDisponibles = await this.repo.getEstabDispByDate(
        consulta.fecha
      );
      console.log("disponibles:", JSON.stringify(estabDisponibles));
      return estabFilter.filter((e) =>
        estabDisponibles.find(({ id }) => id === e.id)
      );
    }

    return estabFilter;
  }
}
