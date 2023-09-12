import { Dia } from "../models/disponibilidad";

const dias: Dia[] = [
  Dia.Domingo,
  Dia.Lunes,
  Dia.Martes,
  Dia.Miercoles,
  Dia.Jueves,
  Dia.Viernes,
  Dia.Sabado,
];

/** Toma una fecha y devuelve qué `Dia` de la semana cae. Ej: 'Domingo', 'Lunes', 'Martes'. */
export function getDayOfWeek(date: Date): Dia {
  return dias[date.getDay()];
}
