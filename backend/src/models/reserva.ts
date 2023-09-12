import { z } from "zod";
import { decimalSchema } from ".";
import { jugadorSchema } from "./jugador";
import { disponibilidadSchema } from "./disponibilidad";

export type Reserva = z.infer<typeof reservaSchema>;

export const reservaSchema = z.object({
  id: z.number().int().positive(),
  precio: decimalSchema,
  fechaReservada: z.date(),
  fechaCreada: z.date(),
  jugador: jugadorSchema,
  disponibilidad: disponibilidadSchema,
});
