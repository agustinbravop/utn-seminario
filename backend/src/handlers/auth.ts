import { Request, RequestHandler, Response } from "express";
import { tarjetaSchema } from "../models/tarjeta.js";
import { Administrador } from "../models/administrador.js";
import { AuthService } from "../services/auth.js";
import { SuscripcionService } from "../services/suscripciones.js";
import { z } from "zod";

export const registrarAdminSchema = z.object({
  nombre: z.string().nonempty(),
  apellido: z.string().nonempty(),
  telefono: z.string().nonempty(),
  correo: z.string().nonempty(),
  usuario: z.string().nonempty(),
  clave: z.string().nonempty(),
  idSuscripcion: z.number().positive().int(),
  tarjeta: tarjetaSchema.omit({ id: true }),
});

// Se puede iniciar sesión o con usuario o con correo.
export const loginReqSchema = z.object({
  correoOUsuario: z.string().nonempty(),
  clave: z.string().nonempty(),
});

type LoginReq = z.infer<typeof loginReqSchema>;

type RegistroReq = z.infer<typeof registrarAdminSchema>;

export class AuthHandler {
  private service: AuthService;
  private susService: SuscripcionService;

  constructor(service: AuthService, susService: SuscripcionService) {
    this.service = service;
    this.susService = susService;
  }

  login(): RequestHandler {
    return async (_req, res) => {
      const loginReq: LoginReq = res.locals.body;

      const loginResult = await this.service.loginUsuario(
        loginReq.correoOUsuario,
        loginReq.clave
      );

      loginResult.match(
        (token) => res.status(200).json({ token }),
        (err) => res.status(err.status).json(err)
      );
    };
  }

  register(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const body: RegistroReq = res.locals.body;

      // Se obtiene la suscripcion mediante el idSuscripcion.
      const sus = await this.susService.getSuscripcionByID(body.idSuscripcion);
      if (sus.isErr()) {
        const err = sus._unsafeUnwrapErr();
        res.status(err.status).json(err);
        return;
      }

      // Se construye el Administrador del modelo.
      const admin: Administrador = {
        ...body,
        tarjeta: {
          id: 0,
          ...body.tarjeta,
        },
        id: 0,
        suscripcion: sus._unsafeUnwrap(),
      };

      const regResult = await this.service.registrarAdministrador(
        admin,
        body.clave
      );

      regResult.match(
        (admin) => res.status(201).json(admin),
        (err) => res.status(err.status).json(err)
      );
    };
  }
}
