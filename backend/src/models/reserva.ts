import { z } from "zod";
import { jugadorSchema } from "./jugador.js";
import { disponibilidadSchema } from "./disponibilidad.js";
import { pagoSchema } from "./pago.js";

export type Reserva = z.infer<typeof reservaSchema>;

export const reservaSchema = z.object({
  id: z.number().int().positive(),
  precio: z.number(),
  senia: z.number().optional(),
  fechaReservada: z.coerce.date(),
  fechaCreada: z.coerce.date(),
  jugador: jugadorSchema.optional(),
  jugadorNoRegistrado: z.string().optional(),
  disponibilidad: disponibilidadSchema,
  cancelada: z.boolean().default(false),
  pagoReserva: z.lazy(() => pagoSchema.optional()),
  pagoSenia: z.lazy(() => pagoSchema.optional()),
});
