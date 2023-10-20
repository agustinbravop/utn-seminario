import { Reserva } from "@/models";
import { toUTCDate } from "./dates";

/**
 * Devuelve el dinero restante que el jugador debería pagar al establecimiento.
 * El **pago restante** es el precio de la reserva menos el pago de la seña y la reserva.
 * El monto a pagar de la reserva en sí es el precio total menos la seña pagada.
 */
export function pagoRestante(res: Reserva): number {
  const seniaPagada = res.pagoSenia?.monto ?? 0;
  const precioPagado = res.pagoReserva?.monto ?? 0;
  return res.precio - precioPagado - seniaPagada;
}

/** Da la fechaReservada con el horario de inicio de la reserva (en lugar de 00:00:00). */
export function fechaHoraReservada(res: Reserva) {
  const fechaHora = toUTCDate(res.fechaReservada);
  const [hh, mm] = res.disponibilidad.horaInicio.split(":");
  fechaHora.setHours(Number(hh), Number(mm), 0, 0);
  return fechaHora;
}

/** Da la fechaReservada con el horario de fin de la reserva (en lugar de 00:00:00). */
export function fechaHoraFinReserva(res: Reserva) {
  const fechaHora = toUTCDate(res.fechaReservada);
  const [hh, mm] = res.disponibilidad.horaFin.split(":");
  fechaHora.setHours(Number(hh), Number(mm), 0, 0);
  return fechaHora;
}

/** Devuelve `true` si el horario de fin de la reserva todavía no fue alcanzado. */
export function isReservaActiva(reserva: Reserva) {
  return fechaHoraFinReserva(reserva) >= new Date();
}
