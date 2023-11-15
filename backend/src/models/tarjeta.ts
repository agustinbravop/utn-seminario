import { z } from "zod";

export type Tarjeta = z.infer<typeof tarjetaSchema>;

export const tarjetaSchema = z.object({
  id: z.number().positive().int(),
  nombre: z.string().min(1),
  numero: z.string().min(1).min(15).max(19),
  cvv: z.number().int().gt(100).lt(10_000),
  vencimiento: z
    .string()
    .min(1)
    .regex(/\d\d\/\d\d\d?\d?/),
});
