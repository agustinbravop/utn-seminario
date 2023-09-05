import { z } from "zod";
import { decimalSchema } from ".";

export enum Dia {
  Lunes = "Lunes",
  Martes = "Martes",
  Miercoles = "Miércoles",
  Jueves = "Jueves",
  Viernes = "Viernes",
  Sabado = "Sábado",
  Domingo = "Domingo",
}

export type Disponibilidad = z.infer<typeof disponibilidadSchema>;

export const disponibilidadSchema = z.object({
  id: z.number().int().positive(),
  horaInicio: z.string().nonempty().trim(),
  horaFin: z.string().nonempty().trim(),
  precioReserva: decimalSchema,
  precioSenia: decimalSchema.optional(),
  disciplina: z.string().nonempty(),
  dias: z.array(z.nativeEnum(Dia)),
  idCancha: z.number().int().positive(),
});
