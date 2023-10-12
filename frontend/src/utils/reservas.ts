import { Reserva } from "@/models";

/**
 * Devuelve el dinero restante de la reserva que el jugador debería pagar al establecimiento.
 * El pago de la seña es siempre el monto de la seña, o `undefined` si la reserva no pedía seña.
 * El pago de la reserva en sí es el monto total menos la seña pagada, de manera que **el precio de la
 * reserva es lo pagado en la seña más lo pagado en la reserva**.
 */
export function pagoRestante(res: Reserva): number {
  const seniaPagada = res.pagoSenia?.monto ?? 0;
  const precioPagado = res.pagoReserva?.monto ?? 0;
  return res.precio - precioPagado - seniaPagada;
}
