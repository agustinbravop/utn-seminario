import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

/** Renderiza la flecha hacia arriba/abajo del ordenamiento de una columna de una tabla.
 * Si `asc` es `true` indica que el orden es ascendente. Sino, indica un orden descendiente.
 */
export default function IndicadorOrdenColumna({ asc }: { asc: boolean }) {
  return asc ? (
    <TriangleUpIcon color="blue.500" />
  ) : (
    <TriangleDownIcon color="blue.500" />
  );
}
