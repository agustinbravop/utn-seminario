import { Handler, Request, RequestHandler, Response } from "express";
import { tarjetaSchema } from "../models/tarjeta.js";
import { Administrador, administradorSchema } from "../models/administrador.js";
import { AuthService, Rol } from "../services/auth.js";
import { SuscripcionService } from "../services/suscripciones.js";
import { z } from "zod";
import { Jugador, jugadorSchema } from "../models/jugador.js";
import { UnauthorizedError, ForbiddenError } from "../utils/apierrors.js";

export const registrarAdminSchema = administradorSchema
  .omit({ id: true, tarjeta: true, suscripcion: true })
  .extend({
    clave: z.string().min(1),
    idSuscripcion: z.number().positive().int(),
    tarjeta: tarjetaSchema.omit({ id: true }),
  });

type RegistrarAdmin = z.infer<typeof registrarAdminSchema>;

// Se puede iniciar sesión o con usuario o con correo.
export const loginSchema = z.object({
  correoOUsuario: z.string().min(1),
  clave: z.string().min(1),
});

type Login = z.infer<typeof loginSchema>;

export const registrarJugadorSchema = jugadorSchema
  .extend({
    clave: z.string().min(1),
  })
  .omit({ id: true });

type RegistrarJugador = z.infer<typeof registrarJugadorSchema>;

export const cambiarClaveSchema = z.object({
  nueva: z.string().min(1),
  actual: z.string().min(1),
});

type CambiarClave = z.infer<typeof cambiarClaveSchema>;

export const correoResetearClaveSchema = z.object({
  correo: z.string().email(),
});

export const resetearClaveSchema = z.object({
  correo: z.string().email(),
  nueva: z.string().min(1),
  token: z.string().min(1),
});

type ResetearClave = z.infer<typeof resetearClaveSchema>;

export class AuthHandler {
  private service: AuthService;
  private susService: SuscripcionService;

  constructor(service: AuthService, susService: SuscripcionService) {
    this.service = service;
    this.susService = susService;
  }

  login(): RequestHandler {
    return async (_req, res) => {
      const login: Login = res.locals.body;

      const token = await this.service.loginConClave(
        login.correoOUsuario,
        login.clave
      );
      res.status(200).json({ token });
    };
  }

  refreshToken(): RequestHandler {
    return async (req, res) => {
      const currentToken = req.header("Authorization")?.replace("Bearer ", "")!;

      const token = await this.service.refreshJWT(currentToken);
      res.status(200).json({ token });
    };
  }

  registerAdmin(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const body: RegistrarAdmin = res.locals.body;

      // Se obtiene la suscripcion mediante el idSuscripcion.
      const sus = await this.susService.getByID(body.idSuscripcion);

      // Se construye el Administrador del modelo.
      const admin: Administrador = {
        ...body,
        suscripcion: sus,
        tarjeta: { ...body.tarjeta, id: 0 },
        id: 0,
      };

      const adminCreado = await this.service.registrarAdministradorConClave(
        admin,
        body.clave
      );
      res.status(201).json(adminCreado);
    };
  }

  registerJugador(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const body: RegistrarJugador = res.locals.body;

      // Se construye el Jugador del modelo.
      const jugador: Jugador = { ...body, id: 0 };

      const jugadorCreado = await this.service.registrarJugadorConClave(
        jugador,
        body.clave
      );
      res.status(201).json(jugadorCreado);
    };
  }

  patchCambiarClave(): RequestHandler {
    return async (req, res) => {
      const { actual, nueva }: CambiarClave = res.locals.body;

      const header = req.header("Authorization");
      const jwt = await this.verifyAuthorizationHeader(header);
      const correo = jwt.admin?.correo || jwt.jugador?.usuario;
      if (!correo) {
        throw new UnauthorizedError("JWT inválido");
      }

      const token = await this.service.cambiarClave(correo, actual, nueva);
      res.status(200).json({ token });
    };
  }

  postCorreoResetearClave(): RequestHandler {
    return async (_req, res) => {
      const correo = res.locals.body.correo;
      await this.service.generarTokenParaResetearClave(correo);
      res.status(201).json({});
    };
  }

  patchResetearClave(): RequestHandler {
    return async (_req, res) => {
      const { nueva, correo, token }: ResetearClave = res.locals.body;
      const jwt = await this.service.resetearClave(correo, token, nueva);
      res.status(200).json({ token: jwt });
    };
  }

  private async verifyAuthorizationHeader(header: string | undefined) {
    const token = header?.replace("Bearer ", "");
    if (!token) {
      throw new UnauthorizedError("Authorization header inválido");
    }

    const jwt = await this.service.verifyJWT(token);
    if (jwt == null) {
      throw new UnauthorizedError("Token inválido");
    }

    return jwt;
  }

  public isLogged(): Handler {
    return async (req, res, next) => {
      const token = req.header("Authorization");
      const jwt = await this.verifyAuthorizationHeader(token);

      if (
        !this.service.hasRol(jwt, Rol.Administrador) &&
        !this.service.hasRol(jwt, Rol.Jugador)
      ) {
        throw new ForbiddenError("No tiene un rol válido");
      }

      if (this.service.hasRol(jwt, Rol.Administrador)) {
        res.locals.idAdmin = Number(jwt?.admin?.id);
      }
      if (this.service.hasRol(jwt, Rol.Jugador)) {
        res.locals.idJugador = Number(jwt?.jugador?.id);
      }

      next();
    };
  }

  /**
   * Valida que la request tenga un JWT válido y que sea de un usuario **administrador**.
   * Setea `res.locals.idAdmin` con el idAdmin que vino en el JWT.
   */
  public isAdmin(): Handler {
    return async (req, res, next) => {
      const token = req.header("Authorization");
      const jwt = await this.verifyAuthorizationHeader(token);

      if (!this.service.hasRol(jwt, Rol.Administrador)) {
        throw new ForbiddenError("No tiene el rol Administrador");
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
      const token = req.header("Authorization");
      const jwt = await this.verifyAuthorizationHeader(token);

      if (!this.service.hasRol(jwt, Rol.Jugador)) {
        throw new ForbiddenError("No tiene el rol Jugador");
      }

      // Los handlers subsiguientes tienen acceso al idJugador que vino en el JWT.
      res.locals.idJugador = Number(jwt?.jugador?.id);
      next();
    };
  }

  googleRedirect(): RequestHandler {
    return async (req, res) => {
      const code = req.query.code as string;

      const token = await this.service.loginGoogle(code);
      res.status(200).json({ token });
    };
  }
}
