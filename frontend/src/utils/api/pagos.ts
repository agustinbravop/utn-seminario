import { API_URL } from ".";
import { PagoConReserva } from "@/models";
import { useApiQuery, UseApiQueryOptions } from "@/hooks";
import queryString from "query-string";

export function usePagoByID(
  id: number,
  options?: UseApiQueryOptions<PagoConReserva>
) {
  return useApiQuery(
    ["establecimientos", id],
    `${API_URL}/establecimientos/${id}`,
    options
  );
}

export type BuscarPagosQuery = {
  idCancha?: number;
  idEst?: number;
  fechaDesde?: string;
  fechaHasta?: string;
};

export function useBuscarPagos(
  filtros: BuscarPagosQuery,
  options?: UseApiQueryOptions<PagoConReserva[]>
) {
  return useApiQuery(
    ["pagos", "buscar", filtros],
    new URL(`${API_URL}/pagos?${queryString.stringify(filtros)}`),
    { ...options, initialData: [] }
  );
}
