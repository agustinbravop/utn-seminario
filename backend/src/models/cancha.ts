import { z } from "zod";
import { decimalSchema } from "./index.js";

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
  horaInicio: z.string().nonempty(),
  horaFin: z.string().nonempty(),
  precioReserva: decimalSchema,
  precioSenia: decimalSchema.optional(),
  disciplina: z.string().nonempty(),
  dias: z.array(z.nativeEnum(Dia)),
});

export type Cancha = z.infer<typeof canchaSchema>;

export const canchaSchema = z.object({
  id: z.number().positive().int(),
  nombre: z.string().nonempty(),
  descripcion: z.string().default(""),
  habilitada: z.boolean().default(true),
  eliminada: z.boolean().default(false),
  urlImagen: z.string().nonempty().nullable(),
  idEstablecimiento: z.number().positive().int(),
  disciplinas: z.array(z.string().nonempty()).optional(),
  disponibilidades: z.array(disponibilidadSchema).default([]),
});
