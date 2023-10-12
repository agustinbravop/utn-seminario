import { z } from "zod";
import { jugadorSchema } from "./jugador";
import { disponibilidadSchema } from "./disponibilidad";
import { pagoSchema } from "./pago";

export type Reserva = z.infer<typeof reservaSchema>;

export const reservaSchema = z.object({
  id: z.number().int().positive(),
  precio: z.number(),
  senia: z.number().optional(),
  fechaReservada: z.date(),
  fechaCreada: z.date(),
  jugador: jugadorSchema,
  disponibilidad: disponibilidadSchema,
  pagoReserva: pagoSchema.optional(),
  pagoSenia: pagoSchema.optional(),
});
