import { z } from "zod";

export enum Dia {
  Lunes = "Lunes",
  Martes = "Martes",
  Miercoles = "Miércoles",
  Jueves = "Jueves",
  Viernes = "Viernes",
  Sabado = "Sábado",
  Domingo = "Domingo",
}

export const DIAS = [
  Dia.Lunes,
  Dia.Martes,
  Dia.Miercoles,
  Dia.Jueves,
  Dia.Viernes,
  Dia.Sabado,
  Dia.Domingo,
];

export type Disponibilidad = z.infer<typeof disponibilidadSchema>;

export const disponibilidadSchema = z.object({
  id: z.number().int().positive(),
  horaInicio: z.string().min(1).trim(),
  horaFin: z.string().min(1).trim(),
  precioReserva: z.number(),
  precioSenia: z.number().optional(),
  disciplina: z.string().min(1),
  dias: z.array(z.nativeEnum(Dia)),
  idCancha: z.number().int().positive(),
});
