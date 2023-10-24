import { API_URL } from ".";
import { Cancha, Establecimiento, Reserva } from "@/models";
import { useApiQuery, UseApiQueryOptions } from "@/hooks";
import queryString from "query-string";

export type IngresosPorCanchaQuery = {
  idEst?: number;
  fechaDesde?: string;
  fechaHasta?: string;
};

type IngresosPorCancha = Establecimiento & {
  canchas: (Cancha & {
    reservas: Reserva[];
    estimado: number;
    total: number;
  })[];
  estimado: number;
  total: number;
};

export function useInformePagosPorCancha(
  query: IngresosPorCanchaQuery,
  options?: UseApiQueryOptions<IngresosPorCancha>
) {
  return useApiQuery(
    ["informes", "pagosPorCancha", query],
    new URL(
      `${API_URL}/informes/ingresosPorCancha?${queryString.stringify(query)}`
    ),
    { ...options }
  );
}
