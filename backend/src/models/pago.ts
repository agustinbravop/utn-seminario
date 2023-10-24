import { z } from "zod";

export type Pago = z.infer<typeof pagoSchema>;

export const pagoSchema = z.object({
  id: z.number().positive().int(),
  monto: z.number(),
  fechaPago: z.coerce.date(),
  idMetodoDePago: z.string().nonempty(),
});
