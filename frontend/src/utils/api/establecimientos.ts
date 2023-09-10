import { API_URL, del, patchFormData, put, post } from ".";
import { Establecimiento } from "@/models";
import {
  useApiQuery,
  UseApiMutationOptions,
  UseApiQueryOptions,
  useApiMutation,
} from "@/hooks";

export type CrearEstablecimientoReq = Omit<Establecimiento, "id" | "urlImagen">;

export type ModificarEstablecimientoReq = Omit<Establecimiento, "urlImagen">;

function modificarImagen(est: Establecimiento, imagen?: File) {
  if (!imagen) {
    return est;
  }

  const formData = new FormData();
  formData.append("imagen", imagen);
  return patchFormData<Establecimiento>(
    `${API_URL}/establecimientos/${est.id}/imagen`,
    formData
  );
}

export function useEstablecimientoByID(
  id: number,
  options?: UseApiQueryOptions<Establecimiento>
) {
  return useApiQuery(
    ["establecimientos", id],
    `${API_URL}/establecimientos/${id}`,
    options
  );
}

export function useEstablecimientosByAdminID(
  idAdmin: number,
  options?: UseApiQueryOptions<Establecimiento[]>
) {
  return useApiQuery(
    ["establecimientos", "byAdmin", idAdmin],
    `${API_URL}/establecimientos/byAdmin/${idAdmin}`,
    { ...options, initialData: [] }
  );
}

//PROVISIONAL
export function useEstablecimientosPlayer(
  options?: UseApiQueryOptions<Establecimiento[]>
) {
  return useApiQuery(
    ["establecimientos", "jugador"],
    `${API_URL}/establecimientos/jugador`,
    { ...options, initialData: [] }
  );
}
export function useEstablecimientosEliminadosByAdminID(
  idAdmin: number,
  options?: UseApiQueryOptions<Establecimiento[]>
) {
  return useApiQuery(
    ["establecimientos", "deleted", "byAdmin", idAdmin],
    `${API_URL}/establecimientos/byAdmin/deleted/${idAdmin}`,
    { ...options, initialData: [] })
}

export function useCrearEstablecimiento(
  options?: UseApiMutationOptions<
    CrearEstablecimientoReq & { imagen?: File },
    Establecimiento
  >
) {
  return useApiMutation({
    ...options,
    invalidateOnSuccess: () => ["establecimientos"],
    mutationFn: ({ imagen, ...est }) =>
      post<Establecimiento>(`${API_URL}/establecimientos`, est).then((est) =>
        modificarImagen(est, imagen)
      ),
  });
}

export function useModificarEstablecimiento(
  options?: UseApiMutationOptions<
    ModificarEstablecimientoReq & { imagen?: File },
    Establecimiento
  >
) {
  return useApiMutation({
    ...options,
    invalidateOnSuccess: (est) => ["establecimientos", est.id],
    mutationFn: ({ imagen, ...est }) =>
      put<Establecimiento>(`${API_URL}/establecimientos/${est.id}`, est).then(
        (est) => modificarImagen(est, imagen)
      ),
  });
}

export function useEliminarEstablecimiento(
  options?: UseApiMutationOptions<number, Establecimiento>
) {
  return useApiMutation({
    ...options,
    invalidateOnSuccess: () => ["establecimientos"],
    mutationFn: (idEst) => del(`${API_URL}/establecimientos/${idEst}`),
  });
}
