import { z } from "zod";

export type Cancha = z.infer<typeof canchaSchema>;

export const canchaSchema = z.object({
  id: z.number().positive().int(),
  nombre: z.string().nonempty(),
  descripcion: z.string().default(""),
  estaHabilitada: z.boolean().default(true),
  urlImagen: z.string().nonempty().nullable(),
  idEstablecimiento: z.number().positive().int(),
  disciplinas: z.array(z.string().nonempty()),
});
