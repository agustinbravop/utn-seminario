import { JugadorRepository } from "../repositories/jugador.js";
import { Jugador } from "../models/jugador.js";
import { BadRequestError } from "../utils/apierrors.js";

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
    const jugadorDB = await this.getByID(jugador.id);

    // Un jugador registrado mediante un proveedor de OAuth2 no puede cambiar su correo.
    const tieneClave = await this.repo.tieneClave(jugador.id);
    if (!tieneClave && jugadorDB.correo !== jugador.correo) {
      throw new BadRequestError(
        "No puede cambiar su correo si inició sesión mediante OAuth2"
      );
    }
    return await this.repo.modificarJugador(jugador);
  }

  async getByID(id: number): Promise<Jugador> {
    return await this.repo.getJugadorByID(id);
  }
}
