import { API_URL } from ".";
import {
  Cancha,
  Dia,
  Establecimiento,
  PagoConReserva,
  Reserva,
} from "@/models";
import { useApiQuery, UseApiQueryOptions } from "@/hooks";
import queryString from "query-string";

export type ReservasPorCanchaQuery = {
  idEst: number;
  fechaDesde: string;
  fechaHasta: string;
};

export type ReservasPorCancha = Establecimiento & {
  canchas: (Cancha & {
    reservas: Reserva[];
    estimado: number;
    total: number;
  })[];
  estimado: number;
  total: number;
};

export function useInformeReservasPorCancha(
  query: ReservasPorCanchaQuery,
  options?: UseApiQueryOptions<ReservasPorCancha>
) {
  return useApiQuery(
    ["informes", "reservasPorCancha", query],
    `${API_URL}/informes/reservasPorCancha?${queryString.stringify(query)}`,
    { ...options }
  );
}

export type PagosPorCancha = Establecimiento & {
  canchas: (Cancha & {
    pagos: PagoConReserva[];
    total: number;
  })[];
  total: number;
};

export function useInformePagosPorCancha(
  query: ReservasPorCanchaQuery,
  options?: UseApiQueryOptions<PagosPorCancha>
) {
  return useApiQuery(
    ["informes", "pagosPorCancha", query],
    `${API_URL}/informes/pagosPorCancha?${queryString.stringify(query)}`,
    { ...options }
  );
}

type DiasDeSemanaPopularesQuery = {
  idEst?: number;
  horaInicio: string;
  horaFin: string;
};

export function useDiasDeSemanaPopulares(
  query: DiasDeSemanaPopularesQuery,
  options?: UseApiQueryOptions<Record<Dia, number>>
) {
  return useApiQuery(
    ["informes", "diasDeSemana", query],
    `${API_URL}/informes/diasDeSemana?${queryString.stringify(query)}`,
    { ...options }
  );
}
