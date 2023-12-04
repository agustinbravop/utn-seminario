/** Las horas del día, del '1' al '23'. */
export const HORAS = Object.freeze([
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
]);

/** Los minutos de una hora, en múltiplos de 5. */
export const MINUTOS = Object.freeze([
  "00",
  "05",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
]);

export const HORARIOS = Object.freeze(
  HORAS.flatMap((hora) => MINUTOS.map((min) => `${hora}:${min}`))
);
