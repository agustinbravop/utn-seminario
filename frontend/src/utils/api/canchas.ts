import { API_URL, get, del, patchFormData, post, put } from ".";
import { Cancha } from "@/models";
import {
  useApiQuery,
  UseApiMutationOptions,
  useApiMutation,
  UseApiQueryOptions,
} from "@/hooks";

export type CrearCanchaReq = Omit<Cancha, "id" | "urlImagen">;

export type ModificarCanchaReq = Omit<Cancha, "urlImagen">;

function modificarImagen(cancha: Cancha, imagen?: File) {
  if (!imagen) {
    return cancha;
  }

  const formData = new FormData();
  formData.append("imagen", imagen);
  return patchFormData<Cancha>(
    `${API_URL}/establecimientos/${cancha.idEstablecimiento}/canchas/${cancha.id}/imagen`,
    formData
  );
}

export async function crearCancha(
  cancha: CrearCanchaReq,
  imagen?: File
): Promise<Cancha> {
  return post<Cancha>(
    `${API_URL}/establecimientos/${cancha.idEstablecimiento}/canchas`,
    cancha
  ).then((cancha) => modificarImagen(cancha, imagen));
}

export async function useCrearCancha(
  options?: UseApiMutationOptions<CrearCanchaReq & { imagen: File }, Cancha>
) {
  return useApiMutation({
    ...options,
    mutationFn: ({ imagen, ...cancha }) =>
      post<Cancha>(
        `${API_URL}/establecimientos/${cancha.idEstablecimiento}/canchas`,
        cancha
      ).then((cancha) => modificarImagen(cancha, imagen)),
  });
}

export async function modificarCancha(
  cancha: ModificarCanchaReq,
  imagen?: File
): Promise<Cancha> {
  return put<Cancha>(
    `${API_URL}/establecimientos/${cancha.idEstablecimiento}/canchas/${cancha.id}`,
    cancha
  ).then((cancha) => modificarImagen(cancha, imagen));
}

export async function useModificarCancha(
  options?: UseApiMutationOptions<ModificarCanchaReq & { imagen: File }, Cancha>
) {
  return useApiMutation({
    ...options,
    mutationFn: ({ imagen, ...cancha }) =>
      put<Cancha>(
        `${API_URL}/establecimientos/${cancha.idEstablecimiento}/canchas/${cancha.id}`,
        cancha
      ).then((cancha) => modificarImagen(cancha, imagen)),
  });
}

export async function getCanchasByEstablecimientoID(
  idEst: number
): Promise<Cancha[]> {
  return get(`${API_URL}/establecimientos/${idEst}/canchas`);
}

export async function useCanchasByEstablecimientoID(
  idEst: number,
  options: UseApiQueryOptions<Cancha[]>
) {
  return useApiQuery(options, `${API_URL}/establecimientos/${idEst}/canchas`);
}

export async function getCanchaByID(
  idEst: number,
  idCancha: number
): Promise<Cancha> {
  return get(`${API_URL}/establecimientos/${idEst}/canchas/${idCancha}`);
}

export async function useCanchaByID(
  idEst: number,
  idCancha: number,
  options: UseApiQueryOptions<Cancha[]>
) {
  return useApiQuery(
    options,
    `${API_URL}/establecimientos/${idEst}/canchas/${idCancha}`
  );
}

export async function deleteCanchaByID(idEst: number, idCancha: number) {
  return del(`${API_URL}/establecimientos/${idEst}/canchas/${idCancha}`);
}

export async function useEliminarCancha(
  options?: UseApiMutationOptions<{ idEst: number; idCancha: number }, Cancha>
) {
  return useApiMutation({
    ...options,
    mutationFn: ({ idEst, idCancha }) =>
      del(`${API_URL}/establecimientos/${idEst}/canchas/${idCancha}`),
  });
}
