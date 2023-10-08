import { Dia } from "../models/disponibilidad";

/** Sigue el orden de JavaScript. Domingo === 0.  */
const dias: Dia[] = [
  Dia.Domingo,
  Dia.Lunes,
  Dia.Martes,
  Dia.Miercoles,
  Dia.Jueves,
  Dia.Viernes,
  Dia.Sabado,
];

/** Convierte una fecha `Date` a otra fecha `Date` en UTC (Universal Coordinated Time).  */
function convertDateToUTC(date: Date) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
}

/**
 * Toma una fecha y devuelve qué `Dia` de la semana cae ('Domingo', 'Lunes', etc).
 */
export function getDayOfWeek(date: Date): Dia {
  return dias[convertDateToUTC(date).getDay()];
}

/**
 * Inversa a `decimalAHora`
 * @param t el string de una hora a transformar. Ej: '2:00' o '23:30'.
 * @returns un número entre 0 y 23.99. Ej: '2.0' o '23.5'.
 */
export function horaADecimal(t: string) {
  const [hora, minuto] = t.split(":");
  return parseInt(hora, 10) + parseInt(minuto, 10) / 60;
}

/**
 * Inversa a `horaADecimal`
 * @param n el número entre 0 y 23.99. Ej: '2.0' o '23.5'.
 * @returns la hora en formato hh:mm. Ej: '2:00' o '23:30'.
 */
export function decimalAHora(n: number) {
  const entero = Math.trunc(n);
  const minutos = String((n - entero) * 60);
  return `${entero}:${minutos.padEnd(2, "0")}`;
}
