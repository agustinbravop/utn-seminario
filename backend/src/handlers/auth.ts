import { Request, RequestHandler, Response } from "express";
import { tarjetaSchema } from "../models/tarjeta.js";
import { Administrador, administradorSchema } from "../models/administrador.js";
import { AuthService } from "../services/auth.js";
import { SuscripcionService } from "../services/suscripciones.js";
import { z } from "zod";
import { Jugador, jugadorSchema } from "../models/jugador.js";

export const registrarAdminSchema = administradorSchema
  .omit({ id: true, tarjeta: true, suscripcion: true })
  .extend({
    clave: z.string().nonempty(),
    idSuscripcion: z.number().positive().int(),
    tarjeta: tarjetaSchema.omit({ id: true }),
  });


// Se puede iniciar sesión o con usuario o con correo.
export const loginSchema = z.object({
  correoOUsuario: z.string().nonempty(),
  clave: z.string().nonempty(),
});

export const registrarJugadorSchema = jugadorSchema
  .extend({
    clave: z.string().nonempty(),
  })
  .omit({ id: true });

type Login = z.infer<typeof loginSchema>;

type RegistrarAdmin = z.infer<typeof registrarAdminSchema>;

type RegistrarJugador = z.infer<typeof registrarJugadorSchema>;

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

      const token = await this.service.loginUsuario(
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
      const sus = await this.susService.getSuscripcionByID(body.idSuscripcion);

      // Se construye el Administrador del modelo.
      const admin: Administrador = {
        ...body,
        suscripcion: sus,
        tarjeta: { ...body.tarjeta, id: 0 },
        id: 0,
      };

      const adminCreado = await this.service.registrarAdministrador(
        admin,
        body.clave
      );
      res.status(201).json(adminCreado);
    };
  }


  cambiarContrasenia():RequestHandler { 
    return async (req: Request, res:Response)=> { 
       const admin=req.body
       const clave=req.body['claveNueva']
      const administrador=await this.service.cambiarContrasenia(admin, clave) 
      return res.status(200).json(administrador)
    }
  }

  registerJugador(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const body: RegistrarJugador = res.locals.body;

      // Se construye el Jugador del modelo.
      const jugador: Jugador = { ...body, id: 0 };

      const jugadorCreado = await this.service.registrarJugador(
        jugador,
        body.clave
      );
      res.status(201).json(jugadorCreado);
    };
  }

}
