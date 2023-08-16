import jwtDecode from "jwt-decode";
import { post, JWT, API_URL, get } from ".";
import { Administrador, Suscripcion, Tarjeta } from "@/models";
import { writeLocalStorage } from "../storage/localStorage";
import {
  UseApiMutationOptions,
  UseApiQueryOptions,
  useApiMutation,
  useApiQuery,
} from "@/hooks";

export interface RegistrarAdminReq
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

export function useLogin(
  options?: UseApiMutationOptions<
    { correoOUsuario: string; clave: string },
    Administrador
  >
) {
  return useApiMutation({
    ...options,
    mutationFn: (loginAdminReq) =>
      post<JWT>(`${API_URL}/auth/login`, loginAdminReq)
        .then((data) => {
          writeLocalStorage("token", data);
          return jwtDecode(data.token) as { usuario: Administrador };
        })
        .then((payload) => payload.usuario),
  });
}

export async function apiRegister(
  registrarAdmin: RegistrarAdminReq
): Promise<Administrador> {
  return post<Administrador>(`${API_URL}/auth/register`, {
    ...registrarAdmin,
  });
}

export function useRegistrarAdmin(
  options?: UseApiMutationOptions<RegistrarAdminReq, Administrador>
) {
  return useApiMutation({
    ...options,
    mutationFn: (registrarAdminReq) =>
      post<Administrador>(`${API_URL}/auth/register`, registrarAdminReq),
  });
}

export async function getSuscripciones(): Promise<Suscripcion[]> {
  return get(`${API_URL}/suscripciones`);
}

export async function useSuscripciones(
  options: UseApiQueryOptions<Suscripcion[]>
) {
  return useApiQuery(options, `${API_URL}/suscripciones`);
}
