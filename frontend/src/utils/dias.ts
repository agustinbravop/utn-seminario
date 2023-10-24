import { Dia } from "@/models";
import { DIAS } from "./constants";

/**
 * Ordena un arreglo de `Dia`s según el orden de la semana, de Lunes a Domingo.
 * @param dias los dias a ordenar
 */
export function ordenarDias(dias: Dia[]) {
  return dias.sort((a, b) => DIAS.indexOf(a) - DIAS.indexOf(b));
}
