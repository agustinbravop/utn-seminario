import { useReservasByJugadorID } from "@/utils/api";
import ReservaCard from "../ReservaCard/ReservaCard";
import { Heading } from "@chakra-ui/react";
import { useCurrentJugador } from "@/hooks";

export default function ReservaCardList() {
  const { jugador } = useCurrentJugador();
  const { data } = useReservasByJugadorID(jugador.id);
  return (
    <>
      <Heading pb="10px" size="lg" textAlign="center">
        Reservas Activas
      </Heading>
      {data.map((reserva) => (
        <ReservaCard reserva={reserva} />
      ))}
    </>
  );
}
