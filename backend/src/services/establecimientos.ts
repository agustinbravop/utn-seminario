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
  getByAdminID(idAdmin: number): Promise<Establecimiento[]>;
  getByID(idEst: number): Promise<Establecimiento>; 
  getConsulta(consulta:object):Promise<Establecimiento[] | null| Establecimiento>; 
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
    repo: EstablecimientoRepository,
    adminService: AdministradorService
  ) {
    this.repo = repo;
    this.adminService = adminService;
  }

  async getByID(idEst: number) {
    return await this.repo.getByID(idEst);
  }

  async getByAdminID(idAdmin: number) {
    return await this.repo.getByAdminID(idAdmin);
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
    const admin = await this.adminService.getAdministradorByID(idAdmin);

    const ests = await this.repo.getByAdminID(admin.id);

    if (admin.suscripcion.limiteEstablecimientos <= ests.length) {
      throw new ConflictError("Limite de establecimientos alcanzado");
    }
  }

  async eliminar(idEst: number) {
    return await this.repo.eliminar(idEst);
  }

  async getEstablecimientoByNombre(NombreEstablecimiento:string):Promise<Establecimiento> 
  { 
    
    return await this.repo.getEstablecimientoByNombre(NombreEstablecimiento); 
  }

  async getEstablecimientoByLocalidad(NombreLocalidad:string): Promise<Establecimiento[]> 
  { 
    return await this.repo.getEstablecimientoByLocalidad(NombreLocalidad); 
  }

  async getEstablecimientoByProvincia(NombreProvincia:string):Promise<Establecimiento[]>
  { 
    return await this.repo.getEstablecimientoByProvincia(NombreProvincia); 
  }

  async getEstablecimientoByLocalidadANDProvincia(NombreLocalidad:string, NombreProvincia:string):Promise<Establecimiento[]>
  { 
    
    return await this.repo.getEstablecimientoByLocalidadAndProvincia(NombreLocalidad,NombreProvincia); 
  }

  async getEstablecimientoDisciplina(disciplina:string):Promise<Establecimiento[]> { 
    return await this.repo.getEstablecimientoDisciplina(disciplina); 
  }

  async getEstablecimientoAll():Promise<Establecimiento[]> { 
    return await this.repo.getEstablecimientoAll()
  }

  async getConsulta(consulta:object):Promise<Establecimiento[] | null | Establecimiento> 
  { 
    let respuesta=null; 
   if ('localidad' in consulta && 'provincia' in consulta) { 
    respuesta=await this.repo.getEstablecimientoByLocalidadAndProvincia(String(consulta.localidad), String(consulta.provincia));
   }else{ 
    if ('localidad' in consulta) { 
      respuesta=await this.repo.getEstablecimientoByLocalidad(String(consulta.localidad));
    }else { 
      if ('provincia' in consulta) { 
        respuesta=await this.repo.getEstablecimientoByProvincia(String(consulta.provincia)); 
      }else { 
        if ('nombre_establecimiento' in consulta) { 
          respuesta=await this.repo.getEstablecimientoByNombre(String(consulta.nombre_establecimiento));
        }else { 
          if ('disciplina' in consulta) { 
            respuesta=await this.repo.getEstablecimientoDisciplina(String(consulta.disciplina))
          }else { 
            respuesta=await this.repo.getEstablecimientoAll(); 
          }
        }
      }
    }
   }
   

   return respuesta;

  }
  
}
