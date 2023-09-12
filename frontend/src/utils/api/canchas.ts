import { API_URL, del, patchFormData, post, put } from ".";
import { Cancha, Disponibilidad } from "@/models";
import {
  useApiQuery,
  UseApiMutationOptions,
  UseApiQueryOptions,
  useApiMutation,
} from "@/hooks";

export type CrearCancha = Omit<
  Cancha,
  "id" | "urlImagen" | "disponibilidades"
> & {
  disponibilidades: Omit<Disponibilidad, "id">[];
};

export type ModificarCancha = Omit<Cancha, "urlImagen"> & {
  disponibilidades: (Omit<Disponibilidad, "id"> & {
    id?: number | undefined;
  })[];
};

function modificarImagen(cancha: Cancha, imagen?: File) {
  if (!imagen) {
    // No hay imagen nueva para modificar.
    return Promise.resolve(cancha);
  }

  const formData = new FormData();
  formData.append("imagen", imagen);
  return patchFormData<Cancha>(
    `${API_URL}/establecimientos/${cancha.idEstablecimiento}/canchas/${cancha.id}/imagen`,
    formData
  );
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

export function useCrearCancha(
  options?: UseApiMutationOptions<CrearCancha & { imagen?: File }, Cancha>
) {
  return useApiMutation({
    ...options,
    invalidateOnSuccess: (cancha) => [
      "establecimientos",
      cancha.idEstablecimiento,
      "canchas",
    ],
    mutationFn: ({ imagen, ...cancha }) =>
      post<Cancha>(
        `${API_URL}/establecimientos/${cancha.idEstablecimiento}/canchas`,
        cancha
      ).then((cancha) => modificarImagen(cancha, imagen)),
  });
}

export function useModificarCancha(
  options?: UseApiMutationOptions<ModificarCancha & { imagen?: File }, Cancha>
) {
  return useApiMutation({
    ...options,
    invalidateOnSuccess: (cancha) => ["canchas", cancha.id],
    mutationFn: ({ imagen, ...cancha }) =>
      put<Cancha>(
        `${API_URL}/establecimientos/${cancha.idEstablecimiento}/canchas/${cancha.id}`,
        cancha
      ).then((cancha) => modificarImagen(cancha, imagen)),
  });
}

export function useEliminarCancha(
  options?: UseApiMutationOptions<{ idEst: number; idCancha: number }, Cancha>
) {
  return useApiMutation({
    ...options,
    invalidateOnSuccess: (cancha) => [
      "establecimientos",
      cancha.idEstablecimiento,
      "canchas",
    ],
    mutationFn: ({ idEst, idCancha }) =>
      del(`${API_URL}/establecimientos/${idEst}/canchas/${idCancha}`),
  });
}
