import { RequestHandler } from "express";
import { Tarjeta } from "../models/tarjeta";
import { Administrador } from "../models/administrador";
import { AuthService } from "../services/auth";

type LoginReq = {
  correoOUsuario: string;
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
  service: AuthService;

  constructor(service: AuthService) {
    this.service = service;
  }

  login(): RequestHandler {
    return async (req, res) => {
      const loginReq: LoginReq = req.body;

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
    return async (req, res) => {
      const body: RegistroReq = req.body;
      const admin: Administrador = {
        id: 0,
        usuario: body.usuario,
        apellido: body.apellido,
        telefono: body.telefono,
        nombre: body.nombre,
        correo: body.correo,
        tarjeta: body.tarjeta,
        suscripcion: null /* getSuscripcionByID() */,
      };

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
