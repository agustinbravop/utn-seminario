import { z } from "zod";

export type Jugador = z.infer<typeof jugadorSchema>;

export const jugadorSchema = z.object({
  id: z.number().positive().int(),
  nombre: z.string().nonempty(),
  apellido: z.string().nonempty(),
  correo: z.string().nonempty().email(),
  telefono: z.string().nonempty(),
  usuario: z
    .string()
    .nonempty()
    .refine((str) => !str.includes(" ")),
});
