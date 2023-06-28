import Decimal from "decimal.js";
import { z } from "zod";

export const suscripcionSchema = z.object({
  id: z.number().positive().int(),
  nombre: z.string().nonempty(),
  limiteEstablecimientos: z.number().gte(0).int(),
  costoMensual: z.custom<Decimal>(
    (value: unknown) => new Decimal(value as Decimal.Value)
  ),
});

export type Suscripcion = z.infer<typeof suscripcionSchema>;
