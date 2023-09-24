import { API_URL, del, patchFormData, put, post, patch } from ".";
import { Busqueda, Establecimiento } from "@/models";
import {
  useApiQuery,
  UseApiMutationOptions,
  UseApiQueryOptions,
  useApiMutation,
} from "@/hooks";
import queryString from "query-string";

export type CrearEstablecimiento = Omit<Establecimiento, "id" | "urlImagen">;

export type ModificarEstablecimiento = Omit<Establecimiento, "urlImagen">;

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
export function useBuscarEstablecimientos(
  queryParams: Busqueda,
  options?: UseApiQueryOptions<Establecimiento[]>
) {
  return useApiQuery(
    ["establecimientos", "search", queryParams],
    new URL(
      `${API_URL}/establecimientos/ests/search?${queryString.stringify(
        queryParams
      )}`
    ),
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
    { ...options, initialData: [] }
  );
}

export function useCrearEstablecimiento(
  options?: UseApiMutationOptions<
    CrearEstablecimiento & { imagen?: File },
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
    ModificarEstablecimiento & { imagen?: File },
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

export function useHabilitarEstablecimiento(
  options?: UseApiMutationOptions<
    { habilitado: boolean; idEst: number },
    Establecimiento
  >
) {
  return useApiMutation({
    ...options,
    invalidateOnSuccess: (est) => ["establecimientos", est.id],
    mutationFn: ({ habilitado, idEst }) =>
      patch<Establecimiento>(
        `${API_URL}/establecimientos/${idEst}/habilitado`,
        { habilitado }
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
