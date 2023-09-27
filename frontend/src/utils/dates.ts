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
 * Toma un objeto `Date` y devuelve la fecha como un string en formato `aaaa-MM-dd`.
 */
export function formatearFecha(fecha: Date) {
  // Obtiene el día, el mes y el año de la fecha parseada
  const dia = (fecha.getDate() + 1).toString().padStart(2, "0");
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const anio = fecha.getFullYear();

  // Formatea la fecha en "aaaa-MM-dd"
  return `${anio}-${mes}-${dia}`;
}

export function fechaISOaDDMMAAAA(date: string) {
  const fechaOriginal = date;
  const fecha = new Date(fechaOriginal);

  const dia = fecha.getUTCDate();
  const mes = fecha.getUTCMonth() + 1;
  const año = fecha.getUTCFullYear();

  const diaFormateado = dia.toString().padStart(2, '0');
  const mesFormateado = mes.toString().padStart(2, '0');

  return `${diaFormateado}/${mesFormateado}/${año}`;
}
