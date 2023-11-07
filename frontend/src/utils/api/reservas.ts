import {
  UseApiQueryOptions,
  useApiQuery,
  UseApiMutationOptions,
  useApiMutation,
} from "@/hooks";
import { Reserva } from "@/models";
import { API_URL, patch, post } from ".";

export type CrearReserva = {
  idDisponibilidad: number;
  fechaReservada: string;
  nombre?: string;
};

export function useReservasByEstablecimientoID(
  idEst: number,
  options?: UseApiQueryOptions<Reserva[]>
) {
  return useApiQuery(
    ["reservas", "byEst", idEst],
    `${API_URL}/reservas?idEst=${idEst}`,
    { ...options, initialData: [] }
  );
}

export function useReservasByDisponibilidadID(
  idDisp: number,
  options?: UseApiQueryOptions<Reserva[]>
) {
  return useApiQuery(
    ["reservas", "byDisp", idDisp],
    `${API_URL}/reservas?idDisp=${idDisp}`,
    { ...options, initialData: [] }
  );
}

export function useReservasByJugadorID(
  idJugador: number,
  options?: UseApiQueryOptions<Reserva[]>
) {
  return useApiQuery(
    ["reservas", "byJugador", idJugador],
    `${API_URL}/reservas?idJugador=${idJugador}`,
    { ...options, initialData: [] }
  );
}

export function useReservaByID(
  idRes: number,
  options?: UseApiQueryOptions<Reserva>
) {
  return useApiQuery(
    ["reservas", idRes],
    `${API_URL}/reservas/${idRes}`,
    options
  );
}

export function useSeniarReserva(
  options?: UseApiMutationOptions<Reserva, Reserva>
) {
  return useApiMutation({
    ...options,
    invalidateOnSuccess: (r) => ["reservas", r.id],
    mutationFn: (reserva) =>
      patch<Reserva>(`${API_URL}/reservas/${reserva.id}`, reserva),
  });
}

export function useCancelarReserva(
  options?: UseApiMutationOptions<Reserva, Reserva>
) {
  return useApiMutation({
    ...options,
    invalidateOnSuccess: (r) => ["reservas", "byJugador", r.jugador?.id], 
    mutationFn: (reserva) =>
      patch<Reserva>(`${API_URL}/reservas/${reserva.id}/cancelar`, reserva),
  });
}

export function useCancelarReservaAdmin(
  options?: UseApiMutationOptions<Reserva, Reserva>
) {
  return useApiMutation({
    ...options,
    invalidateOnSuccess: (r) => ["reservas", r.id], 
    mutationFn: (reserva) =>
      patch<Reserva>(`${API_URL}/reservas/${reserva.id}/cancelar`, reserva),
  });
}

export function usePagarReserva(
  options?: UseApiMutationOptions<Reserva, Reserva>
) {
  return useApiMutation({
    ...options,    
    invalidateOnSuccess: (r) => ["reservas", r.id],
    mutationFn: (reserva) =>
      patch<Reserva>(`${API_URL}/reservas/pagar/${reserva.id}`, reserva),
  });
}

export function useCrearReserva(options?: UseApiMutationOptions<CrearReserva>) {
  return useApiMutation({
    ...options,
    invalidateManyOnSuccess: [["reservas"], ["disponibilidades"]],
    mutationFn: (reserva) => post<Reserva>(`${API_URL}/reservas`, reserva),
  });
}
