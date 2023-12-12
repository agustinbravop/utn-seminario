import { Dia } from "../models/disponibilidad.js";

/** Días de la semana en el orden de JavaScript. Domingo === 0.  */
const diasDeSemana: Dia[] = [
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
  return diasDeSemana[toUTC(date).getDay()];
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
 * Pone la hora y minutos de `date` al máximo para que sea la mayor fecha de ese día.
 * Esto sirve para usarla como límite superior inclusivo de un rango de fechas.
 */
export function setMaxHours(date: Date) {
  date.setUTCHours(23, 59, 59, 999);
  return date;
}

/**
 * Setea la hora y minuto de un `Date`. Esta función muta al objeto original.
 * El string `hora` debe tener formato `hh:mm`.
 */
export function setHora(date: Date, hora: string) {
  const [hh, mm] = hora.split(":");
  date.setUTCHours(Number(hh), Number(mm), 0, 0);
  return date;
}

/** Devuelve la hora actual de Argentina (UTC-3) en formato `hh:mm`. */
export function getHoraArgentinaActual() {
  return new Date().toLocaleString("es-ar", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Argentina/Buenos_Aires",
  });
}
