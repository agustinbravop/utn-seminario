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
   */
  public isAdmin(): Handler {
    return async (req, res, next) => {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        return res
          .status(401)
          .send(new UnauthorizedError("Authorization header inválido"));
      }

      const jwtPayload = await this.service.verifyJWT(token);
      if (jwtPayload == null) {
        return res.status(401).send(new UnauthorizedError("Token inválido"));
      }

      const roles = this.service.getRolesFromJWT(token);
      if (!roles.includes(Rol.Administrador)) {
        return res
          .status(403)
          .send(new ForbiddenError("No tiene los permisos necesarios"));
      }

      // Los handlers subsiguientes tienen acceso al idAdmin que vino en el JWT.
      res.locals.idAdmin = Number(jwtPayload.usuario.id);
      next();
    };
  }
}
