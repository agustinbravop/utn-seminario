import { z } from "zod";

export const tarjetaSchema = z.object({
  id: z.number().positive().int(),
  nombre: z.string().nonempty(),
  numero: z.string().nonempty().min(15).max(16),
  cvv: z.number().int().gt(100).lt(10_000),
  vencimiento: z
    .string()
    .nonempty()
    .regex(/[0-9]+\/[0-9]+/),
});

export type Tarjeta = z.infer<typeof tarjetaSchema>;
