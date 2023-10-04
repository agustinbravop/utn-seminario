import { z } from "zod";
import { decimalSchema } from ".";
//import { establecimientoSchema } from "./establecimiento";

export type Pago = z.infer<typeof pagoSchema>;

export const pagoSchema = z.object({
  id: z.number().positive().int(),
  monto: decimalSchema,
  fechaPago: z.date(),
  idMetodoDePago: z.string().nonempty(),
});
