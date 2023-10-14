import { useReservasByJugadorID } from "@/utils/api";
import { Box, HStack, Heading, Switch } from "@chakra-ui/react";
import { useCurrentJugador } from "@/hooks";
import { ReservaCard } from "@/components/display";
import { useState } from "react";

export default function JugadorReservasPage() {
  const { jugador } = useCurrentJugador();
  const { data: reservas } = useReservasByJugadorID(jugador.id);
  console.log(reservas)
  const [estado, setEstado] = useState(true);
  
  function isFechaFutura(fecha: string) {
    const reservaDate = new Date(fecha);
    const currentDate = new Date();
    return (
      reservaDate.getUTCFullYear() > currentDate.getUTCFullYear() ||
      (reservaDate.getUTCFullYear() === currentDate.getUTCFullYear() &&
        reservaDate.getUTCMonth() > currentDate.getUTCMonth()) ||
      (reservaDate.getUTCFullYear() === currentDate.getUTCFullYear() &&
        reservaDate.getUTCMonth() === currentDate.getUTCMonth() &&
        reservaDate.getUTCDate() >= currentDate.getUTCDate())
    );
  }

  function handleSwitchChange() {
    setEstado(!estado)
  }

  return (
    <>
      <Heading pb="25px" size="lg" textAlign="center">
        Mis Reservas 
      </Heading>
      <Box mx="10%" mb="17px" justifyContent="center">
        <Switch isChecked={estado}  onChange={handleSwitchChange} colorScheme="blackAlpha"  > Resevas activas</Switch>
      </Box>
      <HStack wrap="wrap" align="center" justify="center">
      {reservas
      .filter((reserva) => !estado || isFechaFutura(reserva.fechaReservada) )
      .map((reserva) => (
        <ReservaCard key={reserva.id} reserva={reserva} />
  ))}
      </HStack>
    </>
  );
}
