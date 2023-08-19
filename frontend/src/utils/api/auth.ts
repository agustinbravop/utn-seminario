import jwtDecode from "jwt-decode";
import { post, JWT, API_URL } from ".";
import { Administrador, Suscripcion, Tarjeta } from "@/models";
import { writeLocalStorage } from "../storage/localStorage";
import {
  UseApiQueryOptions,
  UseApiMutationOptions,
  useApiMutation,
  useApiQuery,
} from "@/hooks";

export interface RegistrarAdminReq
  extends Omit<Administrador, "id" | "tarjeta" | "suscripcion"> {
  idSuscripcion: number;
  tarjeta: Omit<Tarjeta, "id">;
  clave: string;
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

export function useRegistrarAdmin(
  options?: UseApiMutationOptions<RegistrarAdminReq, Administrador>
) {
  return useApiMutation({
    ...options,
    mutationFn: (registrarAdminReq) =>
      post<Administrador>(`${API_URL}/auth/register`, registrarAdminReq),
  });
}

export function useSuscripciones(options?: UseApiQueryOptions<Suscripcion[]>) {
  return useApiQuery(["suscripciones"], `${API_URL}/suscripciones`, options);
}
