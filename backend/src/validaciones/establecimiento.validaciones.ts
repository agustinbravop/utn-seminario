import { z } from "zod";

export const establecimientoSchema = z.object({
  body: z.object({
    nombre: z.string().nonempty("El nombre no puede estar vacio"),
    telefono: z
      .string()
      .nonempty("El telefono no puede estar vacio")
      .length(10, "La longitud del telefono debe ser de 10 caracteres"),
    correo: z
      .string()
      .nonempty("El correo no puede estar vacio")
      .email("Ingrese el correo correctamente"),
    direccion: z.string().nonempty("La direccion no puede estar vacia"),
    localidad: z.string().nonempty("La localidad no puede estar vacia"),
    provincia: z.string().nonempty("La provincia no puede estar vacia"),
    horariosDeAtencion: z
      .string()
      .nonempty("El horario de atención no puede estar vacio"),
  }),
});
