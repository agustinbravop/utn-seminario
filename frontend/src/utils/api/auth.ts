import jwtDecode from "jwt-decode";
import { post, JWT, API_URL } from ".";
import { Administrador, Jugador, Suscripcion, Tarjeta } from "@/models";
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

export interface RegistrarJugadorReq extends Omit<Jugador, "id"> {
  clave: string;
}

type Usuario =
  | {
      admin: Administrador;
      jugador?: never;
    }
  | {
      admin?: never;
      jugador: Jugador;
    };

export function useLogin(
  options?: UseApiMutationOptions<
    { correoOUsuario: string; clave: string },
    Usuario
  >
) {
  return useApiMutation({
    ...options,
    mutationFn: (loginAdminReq) =>
      post<JWT>(`${API_URL}/auth/login`, loginAdminReq).then((data) => {
        writeLocalStorage("token", data);
        const payload: Usuario = jwtDecode(data.token);
        return payload;
      }),
  });
}

export function useRegistrarAdmin(
  options?: UseApiMutationOptions<RegistrarAdminReq, Administrador>
) {
  return useApiMutation({
    ...options,
    mutationFn: (registrarAdminReq) =>
      post<Administrador>(
        `${API_URL}/auth/register/administrador`,
        registrarAdminReq
      ),
  });
}

export function useRegistrarJugador(
  options?: UseApiMutationOptions<RegistrarJugadorReq, Jugador>
) {
  return useApiMutation({
    ...options,
    mutationFn: (registrarJugadorReq) =>
      post<Jugador>(`${API_URL}/auth/register/jugador`, registrarJugadorReq),
  });
}

export function useSuscripciones(options?: UseApiQueryOptions<Suscripcion[]>) {
  return useApiQuery(["suscripciones"], `${API_URL}/suscripciones`, {
    ...options,
    initialData: [],
  });
}
