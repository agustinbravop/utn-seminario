import { API_URL } from ".";
import { Cancha, Establecimiento, Pago } from "@/models";
import { useApiQuery, UseApiQueryOptions } from "@/hooks";
import queryString from "query-string";

export type PagosPorCanchaQuery = {
  idEst?: number;
  fechaDesde?: string;
  fechaHasta?: string;
};

type PagosPorCancha = Establecimiento & {
  canchas: (Cancha & {
    pagos: Pago[];
    total: number;
  })[];
  total: number;
};

export function useInformePagosPorCancha(
  query: PagosPorCanchaQuery,
  options?: UseApiQueryOptions<PagosPorCancha>
) {
  console.log(query);
  return useApiQuery(
    ["informes", "pagosPorCancha", query],
    new URL(
      `${API_URL}/informes/pagosPorCancha?${queryString.stringify(query)}`
    ),
    { ...options }
  );
}
