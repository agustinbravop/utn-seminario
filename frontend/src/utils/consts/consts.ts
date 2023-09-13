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

export const DURACION_RESERVA = [30, 60, 120];

export const HORAS = [
  "1:00",
  "2:00",
  "3:00",
  "4:00",
  "5:00",
  "6:00",
  "7:00",
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];
