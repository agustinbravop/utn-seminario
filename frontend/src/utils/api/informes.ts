import { API_URL } from ".";
import { Cancha, Establecimiento, PagoConReserva, Reserva } from "@/models";
import { useApiQuery, UseApiQueryOptions } from "@/hooks";
import queryString from "query-string";

export type ReservasPorCanchaQuery = {
  idEst?: number;
  fechaDesde?: string;
  fechaHasta?: string;
};

type ReservasPorCancha = Establecimiento & {
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
    new URL(
      `${API_URL}/informes/reservasPorCancha?${queryString.stringify(query)}`
    ),
    { ...options }
  );
}

export type PagosPorCanchaQuery = {
  idEst?: number;
  fechaDesde?: string;
  fechaHasta?: string;
};

type PagosPorCancha = Establecimiento & {
  canchas: (Cancha & {
    pagos: PagoConReserva[];
    total: number;
  })[];
  total: number;
};

export function useInformePagosPorCancha(
  query: PagosPorCanchaQuery,
  options?: UseApiQueryOptions<PagosPorCancha>
) {
  return useApiQuery(
    ["informes", "pagosPorCancha", query],
    new URL(
      `${API_URL}/informes/pagosPorCancha?${queryString.stringify(query)}`
    ),
    { ...options }
  );
}

type EstadisticaHorarios = {
  idEst?: number;
  horaInicio: string;
  horaFinal: string;
};

export type EstadisticaDia = {
  Lunes: number;
  Martes: number;
  Miercoles: number;
  Jueves: number;
  Viernes: number;
  Sabado: number;
  Domingo: number;
};

export function useEstadisticasHorarios(
  query: EstadisticaHorarios,
  options?: UseApiQueryOptions<EstadisticaDia>
) {
  return useApiQuery(
    ["informes", "diasSemana", query],
    new URL(`${API_URL}/informes/estadistica?${queryString.stringify(query)}`),
    { ...options }
  );
}
