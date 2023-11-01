import { z } from "zod";
import { disponibilidadSchema } from "./disponibilidad.js";

export type Cancha = z.infer<typeof canchaSchema>;

export const canchaSchema = z.object({
  id: z.number().positive().int(),
  nombre: z.string().min(1),
  descripcion: z.string().default(""),
  habilitada: z.boolean().default(true),
  eliminada: z.boolean().default(false),
  urlImagen: z.string().min(1).nullable(),
  idEstablecimiento: z.number().positive().int(),
  disciplinas: z.array(z.string().min(1)).optional(),
  disponibilidades: z.array(disponibilidadSchema).default([]),
});
