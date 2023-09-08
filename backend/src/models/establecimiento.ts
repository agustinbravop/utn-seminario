import { z } from "zod";

export type Establecimiento = z.infer<typeof establecimientoSchema>;

export const establecimientoSchema = z.object({
  id: z.number().positive().int(),
  nombre: z.string().nonempty(),
  correo: z.string().nonempty().email(),
  eliminado: z.boolean().default(false),
  habilitado: z.boolean().default(true),
  telefono: z.string().nonempty().max(15),
  direccion: z.string().nonempty(),
  localidad: z.string().nonempty(),
  provincia: z.string().nonempty(),
  urlImagen: z.string().nonempty().nullable(),
  idAdministrador: z.number().positive().int(),
  horariosDeAtencion: z.string().optional().nullable(),
});
