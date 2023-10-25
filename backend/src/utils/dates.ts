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

/**
 * Toma una fecha y devuelve qué `Dia` de la semana cae ('Domingo', 'Lunes', etc).
 */
export function getDiaDeSemana(date: Date): Dia {
  return dias[toUTC(date).getDay()];
}

/** Convierte una fecha `Date` a otra fecha `Date` en UTC (Universal Coordinated Time).  */
export function toUTC(date: Date): Date {
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

/**
 * Pone la hora de `date` al máximo para que sea la mayor fecha de ese día.
 * Esto sirve para usarla como límite superior de un rango de fechas.
 */
export function setMidnight(date: Date) {
  date.setUTCHours(23, 59, 59, 999);
  return date;
}

/**
 * Setea la hora y minuto de un `Date`. Esta función muta al objeto original.
 * El string `hora` debe tener formato `hh:mm`.
 */
export function setHora(date: Date, hora: string) {
  date.setUTCHours(Number(hora.split(":")[0]), Number(hora.split(":")[1]));
  return date;
}

/** Devuelve la hora UTC actual en formato `hh:mm`. */
export function getHoraActual() {
  const date = new Date();
  const hh = String(date.getUTCHours());
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
