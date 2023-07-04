import { z } from "zod";

export const ActualizarCanchaSchema = z.object({
  nombre: z.string().nonempty("El nombre no puede estar vacio"),
  descripcion: z.string().optional(),
  estaHabilitada: z.string(),
  urlImagen: z.custom<Express.Multer.File>().optional(),
});
