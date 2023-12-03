import { Dia } from "@/models";
import fallbackImage from "@/assets/fallback_image.png";

export const FALLBACK_IMAGE_SRC = fallbackImage;

export const LOGO_IMAGE_SRC =
  "https://cdn.discordapp.com/attachments/1031369249345785886/1131656498670485614/SPOILER_logo.png";

export const DISCIPLINAS = [
  "Básquet",
  "Fútbol",
  "Tenis",
  "Pádel",
  "Hockey",
  "Ping Pong",
];

export const DIAS: Dia[] = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

/**
 * Mapea un día de la semana a su abreviación de tres caracteres.
 * @example DIAS_ABBR["Miércoles"] === "Mié" // true
 */
export const DIAS_ABBR: Record<Dia, string> = {
  Lunes: "Lun",
  Martes: "Mar",
  Miércoles: "Mié",
  Jueves: "Jue",
  Viernes: "Vie",
  Sábado: "Sáb",
  Domingo: "Dom",
};

export const DURACION_RESERVA = [30, 45, 60, 90, 120];

/** Las horas del día, del '1' al '23'. */
export const HORAS = [
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
];

/** Los minutos de una hora, en múltiplos de 5. */
export const MINUTOS = [
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
];

export const HORARIOS = HORAS.flatMap((hora) =>
  MINUTOS.map((min) => `${hora}:${min}`)
);
