import { API_URL, del, post, put } from ".";
import { Cancha, Disponibilidad } from "@/models";
import {
  useApiQuery,
  UseApiMutationOptions,
  UseApiQueryOptions,
  useApiMutation,
} from "@/hooks";
import queryString from "query-string";

export type CrearDisponibilidad = Omit<Disponibilidad, "id"> & {
  idEst: number;
};

export type ModificarDisponibilidad = Disponibilidad & {
  idEst: number;
};

export function useDisponibilidadesByCanchaID(
  idEst: number,
  idCancha: number,
  options?: UseApiQueryOptions<Disponibilidad[]>
) {
  return useApiQuery(
    ["canchas", idCancha, "disponibilidades"],
    `${API_URL}/establecimientos/${idEst}/canchas/${idCancha}/disponibilidades`,
    { ...options, initialData: [] }
  );
}

export function useDisponibilidadByID(
  idDisp: number,
  options?: UseApiQueryOptions<Disponibilidad>
) {
  return useApiQuery(
    ["disponibilidades", idDisp],
    `${API_URL}/disponibilidades/${idDisp}`,
    options
  );
}

export type BuscarDisponibilidadesFiltros = {
  idCancha?: number;
  idEst?: number;
  disciplina?: string;
  fechaDisponible?: string;
};

export type BuscarDisponibilidadResult = Disponibilidad & {
  cancha: Cancha;
};

export function useBuscarDisponibilidades(
  filtros: BuscarDisponibilidadesFiltros,
  options?: UseApiQueryOptions<BuscarDisponibilidadResult[]>
) {
  return useApiQuery(
    ["disponibilidades", "buscar", filtros],
    new URL(`${API_URL}/disponibilidades?${queryString.stringify(filtros)}`),
    { ...options, initialData: [] }
  );
}

export function useCrearDisponibilidad(
  options?: UseApiMutationOptions<CrearDisponibilidad, Disponibilidad>
) {
  return useApiMutation({
    ...options,
    invalidateOnSuccess: () => ["disponibilidades"],
    mutationFn: ({ idEst, ...disp }) =>
      post<Disponibilidad>(`${API_URL}/disponibilidades`, disp),
  });
}

export function useModificarDisponibilidad(
  options?: UseApiMutationOptions<ModificarDisponibilidad, Disponibilidad>
) {
  return useApiMutation({
    ...options,
    invalidateOnSuccess: () => ["disponibilidades"],
    mutationFn: ({ idEst, ...disp }) =>
      put<Disponibilidad>(`${API_URL}/disponibilidades/${disp.id}`, disp),
  });
}

export function useEliminarDisponibilidad(
  options?: UseApiMutationOptions<
    { idEst: number; idCancha: number; idDisp: number },
    Disponibilidad
  >
) {
  return useApiMutation({
    ...options,
    invalidateOnSuccess: () => ["disponibilidades"],
    mutationFn: ({ idDisp }) => del(`${API_URL}/disponibilidades/${idDisp}`),
  });
}
