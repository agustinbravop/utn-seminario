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
  
  function isFechaFutura(fecha: string, horaFin: string) {
    const reservaDate = new Date(fecha);
    const [hora, minutos] = horaFin.split(":");
    reservaDate.setHours(Number(hora), Number(minutos), 0, 0)
    const currentDate = new Date();
    return (
      reservaDate >= currentDate)
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
      .filter((reserva) => !estado || isFechaFutura(reserva.fechaReservada, reserva.disponibilidad.horaFin) )
      .map((reserva) => (
        <ReservaCard key={reserva.id} reserva={reserva} />
  ))}
      </HStack>
    </>
  );
}
