import { get, API_URL, del, patchFormData, put, post } from ".";
import { Establecimiento } from "@/models";
import {
  useApiQuery,
  UseApiMutationOptions,
  useApiMutation,
  UseApiQueryOptions,
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

export async function crearEstablecimiento(
  est: CrearEstablecimientoReq,
  imagen?: File
): Promise<Establecimiento> {
  return post<Establecimiento>(`${API_URL}/establecimientos`, est).then((est) =>
    modificarImagen(est, imagen)
  );
}

export function useCrearEstablecimiento(
  options?: UseApiMutationOptions<
    CrearEstablecimientoReq & { imagen: File },
    Establecimiento
  >
) {
  return useApiMutation({
    ...options,
    mutationFn: ({ imagen, ...est }) =>
      post<Establecimiento>(`${API_URL}/establecimientos`, est).then((est) =>
        modificarImagen(est, imagen)
      ),
  });
}

export async function modificarEstablecimiento(
  establecimiento: ModificarEstablecimientoReq,
  imagen?: File
): Promise<Establecimiento> {
  return put<Establecimiento>(
    `${API_URL}/establecimientos/${establecimiento.id}`,
    establecimiento
  ).then((est) => modificarImagen(est, imagen));
}

export async function useModificarEstablecimiento(
  options?: UseApiMutationOptions<
    ModificarEstablecimientoReq & { imagen: File },
    Establecimiento
  >
) {
  return useApiMutation({
    ...options,
    mutationFn: ({ imagen, ...est }) =>
      put<Establecimiento>(`${API_URL}/establecimientos/${est.id}`, est).then(
        (est) => modificarImagen(est, imagen)
      ),
  });
}

export async function getEstablecimientosByAdminID(
  idAdmin: number
): Promise<Establecimiento[]> {
  return get(`${API_URL}/establecimientos/byAdmin/${idAdmin}`);
}

export async function useEstablecimientosByAdminID(
  idAdmin: number,
  options: UseApiQueryOptions<Establecimiento[]>
) {
  return useApiQuery(options, `${API_URL}/establecimientos/byAdmin/${idAdmin}`);
}

export async function getEstablecimientoByID(
  id: number
): Promise<Establecimiento> {
  return get(`${API_URL}/establecimientos/${id}`);
}

export async function useEstablecimientoByID(
  id: number,
  options: UseApiQueryOptions<Establecimiento>
) {
  return useApiQuery(options, `${API_URL}/establecimientos/${id}`);
}

export async function deleteEstablecimientoByID(idEst: number) {
  return del(`${API_URL}/establecimientos/${idEst}`);
}

export async function useEliminarEstablecimiento(
  options?: UseApiMutationOptions<number, Establecimiento>
) {
  return useApiMutation({
    ...options,
    mutationFn: (idEst) => del(`${API_URL}/establecimientos/${idEst}`),
  });
}
