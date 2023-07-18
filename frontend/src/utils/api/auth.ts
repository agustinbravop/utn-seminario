import jwtDecode from "jwt-decode";
import { post, JWT, API_URL, get } from ".";
import { Administrador, Suscripcion, Tarjeta } from "../../models";
import { writeLocalStorage } from "../storage/localStorage";

export interface RegistrarAdmin
  extends Omit<Administrador, "id" | "tarjeta" | "suscripcion"> {
  idSuscripcion: number;
  tarjeta: Omit<Tarjeta, "id">;
  clave: string;
}

export async function apiLogin(
  correoOUsuario: string,
  clave: string
): Promise<Administrador> {
  return post<JWT>(`${API_URL}/auth/login`, {
    correoOUsuario: correoOUsuario,
    clave: clave,
  })
    .then((data) => {
      writeLocalStorage("token", data);
      return jwtDecode(data.token) as { usuario: Administrador };
    })
    .then((payload) => payload.usuario);
}

export async function apiRegister(
  registrarAdmin: RegistrarAdmin
): Promise<Administrador> {
  return post<Administrador>(`${API_URL}/auth/register`, {
    ...registrarAdmin,
  });
}

export async function getSuscripciones(): Promise<Suscripcion[]> {
  return get(`${API_URL}/suscripciones`);
}
