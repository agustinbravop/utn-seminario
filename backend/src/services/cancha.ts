import { Result,err} from "neverthrow";
import { Cancha } from "../models/cancha";
import { ApiError  } from "../utils/apierrors";
import { CanchaRepository } from "../repositories/cancha";
import { subirImagen } from "../utils/imagenes";

export interface CanchaService { 
    getCanchaByEstablecimientoByID(idEst:number):Promise<Result<Cancha[],ApiError>>; 
    getCanchaByID(idCancha:number):Promise<Result<Cancha,ApiError>>; 
    crearCancha(cancha:Cancha,idEst:number, imagen?:Express.Multer.File ):Promise<Result<Cancha,ApiError>>; 
}

export class CanchaServiceimpl implements CanchaService { 
    private repo: CanchaRepository

    constructor(service:CanchaRepository) { 
        this.repo=service
    }

    async getCanchaByEstablecimientoByID(idEst: number): Promise<Result<Cancha[], ApiError>> {
        return await this.repo.getCanchaByEstablecimientoByID(idEst)
    }

    async getCanchaByID(idCancha: number): Promise<Result<Cancha, ApiError>> {
        return await this.repo.getCanchaByID(idCancha); 
    }
    async crearCancha(
        cancha: Cancha, 
        idEst:number,
        imagen?:Express.Multer.File, 
        ): Promise<Result<Cancha, ApiError>> {
            let urlImagen=null; 
            if (imagen) { 
                if (imagen.mimetype.startsWith('image/')) {
                try { 
                    
                    
                    urlImagen=await subirImagen(imagen)
                    cancha.urlImagen=urlImagen
                    cancha.idEstablecimiento=idEst
                  
                }catch(e) { 
                    return err(new ApiError(500, "Error al subir la imagen"))
                } 
            }else { 
                return err(new ApiError(500,"El archivo ingresado no es una imagen"))
            } 
            }else { 
                return err(new ApiError(500, "La imagen es obligatoria. Ingrese una imagen"))
            } 
            
       
        return await this.repo.crearCancha(cancha); 
    }
}