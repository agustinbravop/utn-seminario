import { z } from "zod";

export const establecimientoSchemaUpdate = z.object({
  body: z.object({
    nombre: z.string().optional(),
    telefono: z
      .string()
      .length(10, "La longitud del telefono debe ser de 10 caracteres")
      .optional(),
    correo: z
      .string()
      .email("Ingrese el correo correctamente")
      .optional(),
    direccion: z.string().optional(),
    localidad: z.string().optional(),
    provincia: z.string().optional(),
    horariosDeAtencion: z
      .string()
      .optional(),
  }),
});
