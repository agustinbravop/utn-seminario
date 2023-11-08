import { Reserva } from "@/models";
import { CircleIcon } from "../media-and-icons";
import { colorEstadoReserva, estadoReserva } from "@/utils/reservas";

interface ReservaEstadoProps {
  res: Reserva;
}

/**
 * Muestra el estado del pago de la reserva acompañado de un color.
 * 'Pagada' es verde, 'Señada' es amarillo, y 'No pagada' es rojo.
 */
export default function ReservaEstado({ res }: ReservaEstadoProps) {
  const estado = estadoReserva(res);

  return (
    <>
      {estado + " "}
      <CircleIcon color={colorEstadoReserva(estado)} verticalAlign="-0.2em" />
    </>
  );
}
