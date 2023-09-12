import { JugadorRepository } from "../repositories/jugador.js";
import { Jugador } from "../models/jugador.js";

export interface JugadorService {
  getByID(id: Number): Promise<Jugador>;
  modificar(jugador: Jugador): Promise<Jugador>;
}

export class JugadorServiceImpl implements JugadorService {
  private repo: JugadorRepository;

  constructor(repository: JugadorRepository) {
    this.repo = repository;
  }

  async modificar(jugador: Jugador): Promise<Jugador> {
    return await this.repo.modificarJugador(jugador);
  }

  async getByID(id: number): Promise<Jugador> {
    return await this.repo.getJugadorByID(id);
  }
}
