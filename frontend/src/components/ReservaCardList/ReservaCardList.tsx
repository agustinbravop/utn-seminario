import { useReservasByJugadorID } from "@/utils/api";
import ReservaCard from "../ReservaCard/ReservaCard";
import { Heading, VStack } from "@chakra-ui/react";
import { useCurrentJugador } from "@/hooks";

export default function ReservaCardList() {
  const { jugador } = useCurrentJugador();
  const { data: reservas } = useReservasByJugadorID(jugador.id);
  return (
    <>
      <Heading pb="10px" size="lg" textAlign="center">
        Reservas Activas
      </Heading>
      <VStack>
        {reservas.map((reserva) => (
          <ReservaCard reserva={reserva} />
        ))}
      </VStack>
    </>
  );
}
