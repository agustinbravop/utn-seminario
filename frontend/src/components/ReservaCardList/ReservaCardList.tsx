import { useReservasByJugadorID } from "@/utils/api";
import ReservaCard from "../ReservaCard/ReservaCard";
import { Box, Heading } from "@chakra-ui/react";
import { useCurrentJugador } from "@/hooks";

export default function ReservaCardList() {
  const { jugador } = useCurrentJugador();
  const { data } = useReservasByJugadorID(jugador.id);
  return (
    <>
      <Heading pb="10px" size="lg" textAlign="center">
        Reservas Activas
      </Heading>
      <Box width="100%" display="flex" flexWrap="wrap" justifyContent="center">
        {data.map((reserva) => (
          <ReservaCard width={{ base: "100%", md: "30%" }} reserva={reserva} />
        ))}
      </Box>
    </>
  );
}
