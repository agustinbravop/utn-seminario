import { HORAS, MINUTOS } from "@/utils/constants";

export function Horarios() {
  const tiempo = Array();
  let tiempoTemp;
  HORAS.forEach((element) => {
    MINUTOS.forEach((x) => {
      tiempoTemp = element + ":" + x;
      tiempo.push(tiempoTemp);
    });
  });
  return tiempo;
}
