/**
 * Inversa a `decimalAHora`
 * @param t el string de una hora a transformar. Ej: '2:00' o '23:30'.
 * @returns un número entre 0 y 23.99. Ej: '2.0' o '23.5'.
 */
export function horaADecimal(t: string | undefined) {
  if (!t) {
    return 0;
  }
  const [hora, minuto] = t.split(":");
  return parseInt(hora, 10) + parseInt(minuto, 10) / 60;
}

/**
 * Inversa a `horaADecimal`
 * @param n el número entre 0 y 23.99. Ej: '2.0' o '23.5'.
 * @returns la hora en formato hh:mm. Ej: '2:00' o '23:30'.
 */
export function decimalAHora(n: number | undefined) {
  if (!n) {
    return "0:00";
  }
  const entero = Math.trunc(n);
  const minutos = String(Math.round((n - entero) * 60));
  return `${String(entero).padStart(2, "0")}:${minutos.padStart(2, "0")}`;
}

/** Devuelve la hora local actual en formato `hh:mm`. */
export function getHoraActual() {
  const date = new Date();
  const hh = String(date.getHours());
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/**
 * Toma un objeto `Date` y devuelve la fecha como un string en formato `aaaa-MM-dd`.
 */
export function formatFecha(fecha: Date) {
  // Obtiene el día, el mes y el año de la fecha parseada
  const dia = fecha.getDate().toString().padStart(2, "0");
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const anio = fecha.getFullYear();

  return `${anio}-${mes}-${dia}`;
}

/** Convierte una fecha en formato ISO a un objecto `Date` en UTC (Universal Coordinated Time).  */
export function toUTCDate(isoDate: string) {
  const date = new Date(isoDate);
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
 * Toma un string de una fecha en formato ISO y devuelve solo la fecha (sin la hora) en formato local.
 * Usar esta función para mostrar la fecha al usuario de manera amigable y localizada.
 */
export function formatFechaISO(iso: string) {
  return toUTCDate(iso).toLocaleDateString("es-ar");
}

/**
 * Toma un string de una fecha en formato ISO y devuelve la fecha y hora en formato local.
 * Usar esta función para mostrar la fecha y hora al usuario de manera amigable y localizada.
 */

export function formatISO(iso: string) {
  return toUTCDate(iso).toLocaleString("es-ar");
}

/** `desde` y `hasta` son fechas ISO sin tiempo.
 * Devuelve `true` si `date` (otra fecha ISO) está entre ellas.
 * `date` puede tener un tiempo.
 * La comparación es inclusiva.
 * Si no se pasan parámetros, devuelve `true`.
 */
export function estaEntreFechas(date: string, desde?: string, hasta?: string) {
  if (desde && hasta) {
    const hastaDate = new Date(hasta);
    hastaDate.setDate(hastaDate.getDate() + 1);
    return date > desde && date < hastaDate.toISOString();
  } else if (desde) {
    return date > desde;
  } else if (hasta) {
    const hastaDate = new Date(hasta);
    hastaDate.setDate(hastaDate.getDate() + 1);
    return date < hastaDate.toISOString();
  } else {
    return true;
  }
}
