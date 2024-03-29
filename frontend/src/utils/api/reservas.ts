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
  options?: UseApiMutationOptions<{ idRes: number }, Reserva>
) {
  return useApiMutation({
    ...options,
    invalidateOnSuccess: (r) => ["reservas", r.id],
    mutationFn: ({ idRes }) =>
      patch<Reserva>(`${API_URL}/reservas/${idRes}`, {}),
  });
}

export function useCancelarReserva(
  options?: UseApiMutationOptions<{ idReserva: number }, Reserva>
) {
  return useApiMutation({
    ...options,
    invalidateOnSuccess: (r) => ["reservas", "byJugador", r.jugador?.id],
    mutationFn: ({ idReserva }) =>
      patch<Reserva>(`${API_URL}/reservas/${idReserva}/cancelar`, {}),
  });
}

export function useCancelarReservaAdmin(
  options?: UseApiMutationOptions<{ idReserva: number }, Reserva>
) {
  return useApiMutation({
    ...options,
    invalidateOnSuccess: (r) => ["reservas", r.id],
    mutationFn: ({ idReserva }) =>
      patch<Reserva>(`${API_URL}/reservas/${idReserva}/cancelar`, {}),
  });
}

export function usePagarReserva(
  options?: UseApiMutationOptions<{ idRes: number }, Reserva>
) {
  return useApiMutation({
    ...options,
    invalidateOnSuccess: (r) => ["reservas", r.id],
    mutationFn: ({ idRes }) =>
      patch<Reserva>(`${API_URL}/reservas/pagar/${idRes}`, {}),
  });
}

export function useCrearReserva(
  options?: UseApiMutationOptions<CrearReserva, Reserva>
) {
  return useApiMutation({
    ...options,
    invalidateManyOnSuccess: [["reservas"], ["disponibilidades"]],
    mutationFn: (reserva) => post<Reserva>(`${API_URL}/reservas`, reserva),
  });
}
