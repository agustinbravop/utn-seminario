import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    correo: z
      .string()
      .nonempty("El Correo es Requerido")
      .email({ message: " Escriba correctamente el correo electronico" }),
    usuario: z
      .string()
      .nonempty("El usuario no puede estar vacio")
      .min(4, "El usuario tiene que tener minimo 4 caracteres"),
    clave: z
      .string()
      .nonempty("La clave no puede estar vacia")
      .min(8, "La longitud minima de caracteres es de 8"),
    nombre: z.string().nonempty("El nombre no puede ser vacio"),
    apellido: z.string().nonempty("El apellido no puede ser vacio"),
    telefono: z
      .string()
      .nonempty("El telefono no puede estar vacio")
      .length(10, "La longitud del telefono debe ser de 10 caracteres"),
    tarjeta: z.object({
      nombre: z.string().nonempty("El nombre de la tarjeta no puede ser vacio"),
      numero: z
        .string()
        .nonempty("El numero de tarjeta no puede ser vacio")
        .length(19, "La longitud debe ser de 19 caracteres"),
      cvv: z
        .number()
        .nonnegative("No se permiten numeros negativos")
        .min(3, "La longitud minima es de 3")
        .gte(100, "El numero debe ser mayor o igual a 100")
        .lte(999, "El numero debe ser menor o igual 999"),
    }),
  }),
});
