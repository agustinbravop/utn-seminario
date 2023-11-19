import jwtDecode from "jwt-decode";
import { post, JWT, API_URL, get, patch } from ".";
import { Administrador, Jugador, Suscripcion, Tarjeta } from "@/models";
import { writeLocalStorage } from "../localStorage";
import {
  UseApiQueryOptions,
  UseApiMutationOptions,
  useApiMutation,
  useApiQuery,
} from "@/hooks";

export interface RegistrarAdmin
  extends Omit<Administrador, "id" | "tarjeta" | "suscripcion"> {
  idSuscripcion: number;
  tarjeta: Omit<Tarjeta, "id">;
  clave: string;
}

export interface RegistrarJugador extends Omit<Jugador, "id"> {
  clave: string;
}

export type ModificarAdmin = Omit<Administrador, "suscripcion" | "tarjeta">;

export type ModificarJugador = Jugador;

export type Usuario =
  | {
      admin: Administrador;
      jugador?: never;
    }
  | {
      admin?: never;
      jugador: Jugador;
    };

export type CambiarClave = {
  actual: string;
  nueva: string;
};

/**
 * Helper function que toma un token, lo escribe a localStorage,
 * y devuelve una promise con su payload decodificado.
 */
export function captureToken(jwt: JWT) {
  writeLocalStorage("token", jwt);
  const payload: Usuario = jwtDecode(jwt.token);
  return Promise.resolve(payload);
}

export async function refreshToken() {
  return get<JWT>(`${API_URL}/auth/token`).then(captureToken);
}

export function useLogin(
  options?: UseApiMutationOptions<
    { correoOUsuario: string; clave: string },
    Usuario
  >
) {
  return useApiMutation({
    ...options,
    mutationFn: (loginAdminReq) =>
      post<JWT>(`${API_URL}/auth/login`, loginAdminReq).then(captureToken),
  });
}

export function useRegistrarAdmin(
  options?: UseApiMutationOptions<RegistrarAdmin, Administrador>
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

export function useModificarAdministrador(
  options?: UseApiMutationOptions<ModificarAdmin, Administrador>
) {
  return useApiMutation({
    ...options,
    mutationFn: (admin) =>
      patch<Administrador>(`${API_URL}/administradores/${admin.id}`, admin)
        .then(() => get<JWT>(`${API_URL}/auth/token`))
        .then(captureToken)
        .then((payload) => payload.admin!),
  });
}

export function useSuscripciones(options?: UseApiQueryOptions<Suscripcion[]>) {
  return useApiQuery(["suscripciones"], `${API_URL}/suscripciones`, {
    ...options,
    initialData: [],
  });
}

export function useCambiarSuscripcion(
  options?: UseApiMutationOptions<
    { id: number; idSuscripcion: number },
    Administrador
  >
) {
  return useApiMutation({
    ...options,
    mutationFn: ({ id, idSuscripcion }) =>
      patch<Administrador>(`${API_URL}/administradores/${id}`, {
        id,
        suscripcion: { id: idSuscripcion },
      })
        .then(() => get<JWT>(`${API_URL}/auth/token`))
        .then(captureToken)
        .then((payload) => payload.admin!),
  });
}

export function useRegistrarJugador(
  options?: UseApiMutationOptions<RegistrarJugador, Jugador>
) {
  return useApiMutation({
    ...options,
    mutationFn: (registrarJugadorReq) =>
      post<Jugador>(`${API_URL}/auth/register/jugador`, registrarJugadorReq),
  });
}

export function useModificarJugador(
  options?: UseApiMutationOptions<ModificarJugador, Jugador>
) {
  return useApiMutation({
    ...options,
    mutationFn: (jugador) =>
      patch<Jugador>(`${API_URL}/jugadores/${jugador.id}`, jugador)
        .then(() => get<JWT>(`${API_URL}/auth/token`))
        .then(captureToken)
        .then((payload) => payload.jugador!),
  });
}

export function useCambiarClave(
  options?: UseApiMutationOptions<CambiarClave, Usuario>
) {
  return useApiMutation({
    ...options,
    mutationFn: (claves) =>
      patch<JWT>(`${API_URL}/auth/clave`, claves).then(captureToken),
  });
}
type recuperarClave = {
  correo: string,
}
export function useEnviarMail(
  options?: UseApiMutationOptions<recuperarClave>
  ) {
    console.log("(API front)options: " + options)
    return useApiMutation({
      ...options,
      mutationFn: (correo) =>
        patch<String>(`${API_URL}/auth/recuperar-clave`, correo),
    });
}
