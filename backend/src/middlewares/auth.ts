import { Handler } from "express";
import { AuthService, Rol } from "../services/auth.js";
import { ApiError } from "../utils/apierrors.js";

export class AuthMiddleware {
  private service: AuthService;

  constructor(service: AuthService) {
    this.service = service;
  }

  public isAdmin(): Handler {
    return async (req, res, next) => {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        return res
          .status(401)
          .send(new ApiError(401, "Authorization header inválido"));
      }

      const esValido = await this.service.verifyJWT(token);
      if (!esValido) {
        return res.status(401).send(new ApiError(401, "Token inválido"));
      }

      const roles = this.service.getRolesFromJWT(token);
      if (!roles.includes(Rol.Administrador)) {
        return res
          .status(403)
          .send(new ApiError(403, "No tiene los permisos necesarios"));
      }

      next();
    };
  }
}
