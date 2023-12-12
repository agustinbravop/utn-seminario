import { PagoConReserva } from "@/models";

/**
 * Devuelve el tipo de pago según el monto de la reserva pagado.
 * - "Seña": se pagó el monto de la seña.
 * - "Total": se pagó el monto completo de la reserva.
 * - "Restante": se pagó el monto restante de la reserva luego de señar (completo menos lo señado).
 */
export function tipoPago(pago: PagoConReserva) {
  if (pago.monto === pago.reserva.senia) {
    return "Seña";
  } else if (pago.monto === pago.reserva.precio) {
    return "Total";
  } else {
    return "Restante";
  }
}
