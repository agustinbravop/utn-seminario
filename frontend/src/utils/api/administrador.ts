import { Administrador } from "@/models";
import { API_URL, JWT, get, patch } from ".";
import { UseApiMutationOptions, useApiMutation } from "@/hooks";
import { writeLocalStorage } from "../storage/localStorage";
import jwtDecode from "jwt-decode";

export type ModificarAdmin = Omit<Administrador, "suscripcion" | "tarjeta">;

export function useModificarAdministrador(
  options?: UseApiMutationOptions<ModificarAdmin, Administrador>
) {
  return useApiMutation({
    ...options,
    mutationFn: (admin) =>
      patch<Administrador>(`${API_URL}/administradores/${admin.id}`, admin)
        .then(() => get<JWT>(`${API_URL}/auth/token`))
        .then((data) => {
          writeLocalStorage("token", data);
          return jwtDecode(data.token) as { usuario: Administrador };
        })
        .then((payload) => payload.usuario),
  });
}

export function useCambiarSuscripcion(
  options?: UseApiMutationOptions<
    { idAdmin: number; idSuscripcion: number },
    Administrador
  >
) {
  return useApiMutation({
    ...options,
    mutationFn: (data) =>
      patch<Administrador>(`${API_URL}/administradores/${data.id}`, data)
        .then(() => get<JWT>(`${API_URL}/auth/token`))
        .then((data) => {
          writeLocalStorage("token", data);
          return jwtDecode(data.token) as { usuario: Administrador };
        })
        .then((payload) => payload.usuario),
  });
}
