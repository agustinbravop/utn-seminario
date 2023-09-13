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

export function formatearFecha(fechaEnFormatoOriginal) {
  // Parsea la fecha en el formato "aaaa-mm-dd"
  const fechaParseada = new Date(fechaEnFormatoOriginal);

  // Obtiene el día, el mes y el año de la fecha parseada
  const dia = (fechaParseada.getDate() + 1).toString().padStart(2, '0');
  const mes = (fechaParseada.getMonth() + 1).toString().padStart(2, '0'); // Suma 1 al mes, ya que en JavaScript los meses van de 0 a 11.
  const anio = fechaParseada.getFullYear();

  // Formatea la fecha en "dd/mm/aaaa"
  const fechaFormateada = `${dia}/${mes}/${anio}`;

  return fechaFormateada;
}