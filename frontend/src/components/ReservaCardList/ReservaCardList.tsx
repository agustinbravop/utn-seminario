import { useReservasByJugadorID } from "@/utils/api";
import ReservaCard from "../ReservaCard/ReservaCard";
import { HStack, Heading } from "@chakra-ui/react";
import { useCurrentJugador } from "@/hooks";

export default function ReservaCardList() {
  const { jugador } = useCurrentJugador();
  const { data: reservas } = useReservasByJugadorID(jugador.id);
  return (
    <>
      <Heading pb="10px" size="lg" textAlign="center">
        Reservas Activas
      </Heading>
      <HStack wrap="wrap" align="center" justify="center">
        {reservas.map((reserva) => (
          <ReservaCard key={reserva.id} reserva={reserva} />
        ))}
      </HStack>
    </>
  );
}
