import { RequestHandler } from "express";
import { JugadorServiceImpl } from "../services/jugador.js";
import { Jugador, jugadorSchema } from "../models/jugador.js";

export const modificarJugadorSchema = jugadorSchema.deepPartial();

export class JugadorHandler {
  private service: JugadorServiceImpl;

  constructor(client: JugadorServiceImpl) {
    this.service = client;
  }

  getJugadorByID(): RequestHandler {
    return async (_req, res) => {
      const idJugador = Number(res.locals.idJugador);
      const result = await this.service.getByID(idJugador);
      res.status(200).json(result);
    };
  }

  patchJugador(): RequestHandler {
    return async (_req, res) => {
      const jugador: Jugador = {
        ...res.locals.body,
        id: Number(res.locals.idJugador),
      };
      const jugadorActualizado = await this.service.modificar(jugador);
      res.status(200).json(jugadorActualizado);
    };
  }
}
