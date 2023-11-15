import { z } from "zod";

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
