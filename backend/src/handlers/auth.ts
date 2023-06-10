import { RequestHandler } from "express";
import { Tarjeta } from "../models/tarjeta.js";
import { Administrador } from "../models/administrador.js";
import { AuthService } from "../services/auth.js";
import { SuscripcionService } from "../services/suscripciones.js";

type LoginReq =
  | {
      usuario: string;
      correo: never;
      clave: string;
    }
  | {
      usuario: never;
      correo: string;
      clave: string;
    };

type RegistroReq = {
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  usuario: string;
  clave: string;
  tarjeta: Tarjeta;
  idSubscripcion: number;
};

export class AuthHandler {
  private service: AuthService;
  private susService: SuscripcionService;

  constructor(service: AuthService, susService: SuscripcionService) {
    this.service = service;
    this.susService = susService;
  }

  login(): RequestHandler {
    return async (req, res) => {
      const loginReq: LoginReq = req.body;

      // Se puede iniciar sesión o con usuario o con correp.
      const correoOUsuario = loginReq.usuario || loginReq.correo;
      const loginResult = await this.service.loginUsuario(
        correoOUsuario,
        loginReq.clave
      );

      loginResult.match(
        (token) => res.status(200).json({ token }),
        (err) => res.status(err.status).json(err)
      );
    };
  }

  register(): RequestHandler {
    return async (req, res) => {
      const body: RegistroReq = req.body;

      // Se obtiene la suscripcion mediante el idSuscripcion.
      const sus = await this.susService.getSuscripcionByID(body.idSubscripcion);
      if (sus.isErr()) {
        const err = sus._unsafeUnwrapErr();
        res.status(err.status).json(err);
        return;
      }

      // Se construye el Administrador del modelo.
      const admin: Administrador = {
        ...body,
        id: 0,
        suscripcion: sus._unsafeUnwrap(),
      };
      console.log(admin);

      const regResult = await this.service.registrarAdministrador(
        admin,
        body.clave
      );

      regResult.match(
        (admin) => res.json(admin),
        (err) => res.status(err.status).json(err)
      );
    };
  }
}
