import { Result } from "neverthrow";
import { ApiError } from "../utils/apierrors.js";
import {AdministradorRepository} from '../repositories/administrador.js'


export interface AdministradorService{ 
    getAdministradorByID(id:Number):Promise<Result<Number,ApiError>>
}

export class AdministradorServiceImpl implements AdministradorService { 
    private repo: AdministradorRepository

    constructor (client:AdministradorRepository) { 
        this.repo=client 
    }

    async getAdministradorByID(id:number): Promise<Result<Number,ApiError>> { 
        return await this.repo.getAdministradorByID(id)
    }

}