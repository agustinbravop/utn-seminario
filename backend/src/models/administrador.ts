import { z } from "zod";
import { suscripcionSchema } from "./suscripcion.js";
import { tarjetaSchema } from "./tarjeta.js";

export type Administrador = z.infer<typeof administradorSchema>;

export const administradorSchema = z.object({
  id: z.number().positive().int(),
  nombre: z.string().min(1),
  apellido: z.string().min(1),
  correo: z.string().min(1).email(),
  telefono: z.string().min(1),
  usuario: z
    .string()
    .min(1)
    .refine((str) => !str.includes(" ")),
  tarjeta: tarjetaSchema,
  suscripcion: suscripcionSchema,
});
