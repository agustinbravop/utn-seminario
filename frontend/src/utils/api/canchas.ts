import { API_URL, del, patchFormData, post, put } from ".";
import { Cancha, Disponibilidad } from "@/models";
import {
  useApiQuery,
  UseApiMutationOptions,
  UseApiQueryOptions,
  useApiMutation,
} from "@/hooks";

export type CrearCanchaReq = Omit<
  Cancha,
  "id" | "urlImagen" | "disponibilidades"
> & {
  disponibilidades: Omit<Disponibilidad, "id">[];
};

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

export function useCrearCancha(
  options?: UseApiMutationOptions<CrearCanchaReq & { imagen?: File }, Cancha>
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

export function useModificarCancha(
  options?: UseApiMutationOptions<
    ModificarCanchaReq & { imagen?: File },
    Cancha
  >
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

export function useCanchasByEstablecimientoID(
  idEst: number,
  options?: UseApiQueryOptions<Cancha[]>
) {
  return useApiQuery(
    ["establecimientos", idEst, "canchas"],
    `${API_URL}/establecimientos/${idEst}/canchas`,
    { ...options, initialData: [] }
  );
}

export function useCanchaByID(
  idEst: number,
  idCancha: number,
  options?: UseApiQueryOptions<Cancha>
) {
  return useApiQuery(
    ["canchas", idCancha],
    `${API_URL}/establecimientos/${idEst}/canchas/${idCancha}`,
    options
  );
}

export function useEliminarCancha(
  options?: UseApiMutationOptions<{ idEst: number; idCancha: number }, Cancha>
) {
  return useApiMutation({
    ...options,
    mutationFn: ({ idEst, idCancha }) =>
      del(`${API_URL}/establecimientos/${idEst}/canchas/${idCancha}`),
  });
}
