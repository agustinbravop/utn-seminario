import { API_URL } from ".";
import { Pago } from "@/models";
import { useApiQuery, UseApiQueryOptions } from "@/hooks";
import queryString from "query-string";

export function usePagoByID(id: number, options?: UseApiQueryOptions<Pago>) {
  return useApiQuery(
    ["establecimientos", id],
    `${API_URL}/establecimientos/${id}`,
    options
  );
}

export type BuscarPagosQuery = {
  idCancha?: number;
  idEst?: number;
};

export function useBuscarPagos(
  filtros: BuscarPagosQuery,
  options?: UseApiQueryOptions<Pago[]>
) {
  return useApiQuery(
    ["pagos", "buscar", filtros],
    new URL(`${API_URL}/pagos?${queryString.stringify(filtros)}`),
    { ...options, initialData: [] }
  );
}
