import { z } from "zod";

export type Establecimiento = z.infer<typeof establecimientoSchema>;

export const establecimientoSchema = z.object({
  id: z.number().positive().int(),
  nombre: z.string().min(1),
  correo: z.string().min(1).email(),
  eliminado: z.boolean().default(false),
  habilitado: z.boolean().default(true),
  telefono: z.string().min(1).max(15),
  direccion: z.string().min(1),
  localidad: z.string().min(1),
  provincia: z.string().min(1),
  urlImagen: z.string().min(1).nullable(),
  idAdministrador: z.number().positive().int(),
  horariosDeAtencion: z.string().optional().nullable(),
  disciplinas: z.array(z.string().min(1)).optional(),
});
