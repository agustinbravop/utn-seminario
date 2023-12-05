import { z } from "zod";
import { reservaSchema } from "./reserva.js";

export enum MetodoDePago {
  Efectivo = "Efectivo",
}

export const metodoDePagoSchema = z.object({
  metodoDePago: z.nativeEnum(MetodoDePago),
});

export type Pago = z.infer<typeof pagoSchema>;

export const pagoSchema = z.object({
  id: z.number().positive().int(),
  monto: z.number(),
  fechaPago: z.coerce.date(),
  metodoDePago: z.nativeEnum(MetodoDePago),
});

// Es necesario `z.lazy()` porque `reservaSchema` necesita `pagoSchema` para definirse.
// `pagoConReserva` incluye todo de una reserva excepto los `pagoReserva` y `pagoSenia`.
export const pagoConReservaSchema = pagoSchema.extend({
  reserva: z.lazy(() =>
    reservaSchema.omit({ pagoReserva: true, pagoSenia: true })
  ),
});

/** Un objeto `Pago` asociado con la `Reserva` a la cual pertenece. */
export type PagoConReserva = z.infer<typeof pagoConReservaSchema>;
