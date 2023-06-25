import { Result} from "neverthrow";
import { Cancha } from "../models/cancha";
import { ApiError } from "../utils/apierrors";
import { CanchaRepository } from "../repositories/cancha";

export interface CanchaService { 
    getCanchaByEstablecimientoByID(idEst:number):Promise<Result<Cancha[],ApiError>>
}

export class CanchaServiceimpl implements CanchaService { 
    private repo: CanchaRepository

    constructor(service:CanchaRepository) { 
        this.repo=service
    }

    async getCanchaByEstablecimientoByID(idEst: number): Promise<Result<Cancha[], ApiError>> {
        return await this.repo.getCanchaByEstablecimientoByID(idEst)
    }
}