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

type EstadisticaHorarios = {
  idEst?: number;
  horaInicio: string;
  horaFinal: string;
};
type EstadisticaDia = {
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
