import { z } from "zod";
import { decimalSchema } from "./index.js";

export type Suscripcion = z.infer<typeof suscripcionSchema>;

export const suscripcionSchema = z.object({
  id: z.number().positive().int(),
  nombre: z.string().nonempty(),
  limiteEstablecimientos: z.number().gte(0).int(),
  costoMensual: decimalSchema,
});
