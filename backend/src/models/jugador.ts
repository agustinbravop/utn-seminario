import { z } from "zod";

export type Jugador = z.infer<typeof jugadorSchema>;

export const jugadorSchema = z.object({
  id: z.number().positive().int(),
  nombre: z.string().min(1),
  apellido: z.string().min(1),
  correo: z.string().min(1).email(),
  telefono: z.string().min(1).optional(),
  usuario: z
    .string()
    .min(1)
    .refine((str) => !str.includes(" ")),
  localidad: z.string().optional(),
  provincia: z.string().optional(),
  disciplina: z.string().optional(),
  tokenCambio: z.string().optional(),

});
