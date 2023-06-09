import { z } from "zod";

export type Establecimiento = z.infer<typeof establecimientoSchema>;

export const establecimientoSchema = z.object({
  id: z.number().positive().int(),
  nombre: z.string().nonempty(),
  correo: z.string().nonempty().email(),
  telefono: z.string().nonempty().max(15),
  direccion: z.string().nonempty(),
  localidad: z.string().nonempty(),
  provincia: z.string().nonempty(),
  urlImagen: z.string().nonempty().nullable(),
  idAdministrador: z.number().positive().int(),
  horariosDeAtencion: z.string().nonempty().nullable(),
});
