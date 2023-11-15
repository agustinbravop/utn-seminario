import { z } from "zod";

export type Suscripcion = z.infer<typeof suscripcionSchema>;

export const suscripcionSchema = z.object({
  id: z.number().positive().int(),
  nombre: z.string().min(1),
  limiteEstablecimientos: z.number().gte(0).int(),
  costoMensual: z.number(),
});
