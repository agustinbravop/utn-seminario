import { Reserva } from "@/models";
import { CircleIcon } from "../media-and-icons";
import { Text, TextProps } from "@chakra-ui/react";

interface ReservaEstadoProps extends TextProps {
  res: Reserva;
}

/**
 * Muestra el estado del pago de la reserva acompañado de un color.
 * 'Pagada' es verde, 'Señada' es amarillo, y 'No pagada' es rojo.
 */
export default function ReservaEstado({ res, ...props }: ReservaEstadoProps) {
  let texto = "No pagada";
  let color = "red";
  if (res.pagoSenia) {
    texto = "Señada";
    color = "orange";
  }
  if (res.pagoReserva) {
    texto = "Pagada";
    color = "green";
  }

  return (
    <Text {...props}>
      {texto} <CircleIcon color={color} verticalAlign="-0.2em" />
    </Text>
  );
}
