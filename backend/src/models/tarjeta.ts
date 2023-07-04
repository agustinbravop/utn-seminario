import { z } from "zod";

export type Tarjeta = z.infer<typeof tarjetaSchema>;

export const tarjetaSchema = z.object({
  id: z.number().positive().int(),
  nombre: z.string().nonempty(),
  numero: z.string().nonempty().min(15).max(19),
  cvv: z.number().int().gt(100).lt(10_000),
  vencimiento: z
    .string()
    .nonempty()
    .regex(/\d\d\/\d\d\d?\d?/),
});
