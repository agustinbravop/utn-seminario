import jwtDecode from "jwt-decode";
import { post, JWT, API_URL, get } from ".";
import { Administrador, Suscripcion } from "../../models";
import { writeLocalStorage } from "../storage/localStorage";

export type RegistrarAdminReq = Omit<Administrador, "id">;

export async function apiLogin(
  correoOUsuario: string,
  clave: string
): Promise<Administrador> {
  return post<JWT>(
    `${API_URL}/auth/login`,
    {
      correoOUsuario: correoOUsuario,
      clave: clave,
    },
    200
  )
    .then((data) => {
      writeLocalStorage("token", data);
      return jwtDecode(data.token) as { usuario: Administrador };
    })
    .then((payload) => payload.usuario)
    .then((data) => data as Administrador);
}

export async function apiRegister(
  usuario: RegistrarAdminReq,
  clave: string
): Promise<Administrador> {
  return post<Administrador>(
    `${API_URL}/auth/register`,
    {
      ...usuario,
      clave,
      idSuscripcion: usuario.suscripcion?.id,
    },
    201
  );
}

export async function getSuscripciones(): Promise<Suscripcion[]> {
  return get(`${API_URL}/suscripciones`);
}
