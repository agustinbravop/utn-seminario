import { Handler } from "express";
import { AuthService, Rol } from "../services/auth.js";
import { ForbiddenError, UnauthorizedError } from "../utils/apierrors.js";

export class AuthMiddleware {
  private service: AuthService;

  constructor(service: AuthService) {
    this.service = service;
  }

  /**
   * Valida que la request tenga un JWT válido y que sea de un usuario **administrador**.
   * Setea `res.locals.idAdmin` con el idAdmin que vino en el JWT.
   */
  public isAdmin(): Handler {
    return async (req, res, next) => {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        return res
          .status(401)
          .send(new UnauthorizedError("Authorization header inválido"));
      }

      const jwt = await this.service.verifyJWT(token);
      if (jwt == null) {
        return res.status(401).send(new UnauthorizedError("Token inválido"));
      }

      const roles = this.service.getRolesFromJWT(token);
      if (!roles.includes(Rol.Administrador)) {
        return res
          .status(403)
          .send(new ForbiddenError("No tiene el rol Administrador"));
      }

      // Los handlers subsiguientes tienen acceso al idAdmin que vino en el JWT.
      res.locals.idAdmin = Number(jwt?.admin?.id);
      next();
    };
  }

  /**
   * Valida que la request tenga un JWT válido y que sea de un usuario **jugador**.
   * Setea `res.locals.idJugador` con el idJugador que vino en el JWT.
   */
  public isJugador(): Handler {
    return async (req, res, next) => {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        return res
          .status(401)
          .send(new UnauthorizedError("Authorization header inválido"));
      }

      const jwt = await this.service.verifyJWT(token);
      if (jwt == null) {
        return res.status(401).send(new UnauthorizedError("Token inválido"));
      }

      const roles = this.service.getRolesFromJWT(token);
      if (!roles.includes(Rol.Jugador)) {
        return res
          .status(403)
          .send(new ForbiddenError("No tiene el rol Jugador"));
      }

      // Los handlers subsiguientes tienen acceso al idJugador que vino en el JWT.
      res.locals.idJugador = Number(jwt?.jugador?.id);
      next();
    };
  }
}
