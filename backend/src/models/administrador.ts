import { z } from "zod";
import { suscripcionSchema } from "./suscripcion.js";
import { tarjetaSchema } from "./tarjeta.js";

export type Administrador = z.infer<typeof administradorSchema>;

export const administradorSchema = z.object({
  id: z.number().positive().int(),
  nombre: z.string().nonempty(),
  apellido: z.string().nonempty(),
  correo: z.string().nonempty().email(),
  telefono: z.string().nonempty().length(15),
  usuario: z
    .string()
    .nonempty()
    .refine((str) => !str.includes(" ")),
  tarjeta: tarjetaSchema,
  suscripcion: suscripcionSchema,
});
