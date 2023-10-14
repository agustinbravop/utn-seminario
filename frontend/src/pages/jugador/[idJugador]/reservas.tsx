import { useReservasByJugadorID } from "@/utils/api";
import { Box, HStack, Heading, Switch, Text } from "@chakra-ui/react";
import { useCurrentJugador } from "@/hooks";
import { ReservaCard } from "@/components/display";
import { useState } from "react";
import { horaADecimal } from "@/utils/dates";
import { Reserva } from "@/models";


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

  const [ordenAscendente, setOrdenAscendente] = useState(true);

  function handleOrdenChange() {
    setOrdenAscendente(!ordenAscendente)
  }


    function filtrarReservas(res: Reserva[]) {
      if (ordenAscendente) {
        return res.sort((a, b) => {
          const fechaHoraA = new Date(a.fechaReservada);
          const fechaHoraB = new Date(b.fechaReservada);
          const horaDecimalA = horaADecimal(a.disponibilidad.horaInicio);
          const horaDecimalB = horaADecimal(b.disponibilidad.horaInicio);
          const fechaHoraEnNumeroA = fechaHoraA.getTime() * 10000 + horaDecimalA;
          const fechaHoraEnNumeroB = fechaHoraB.getTime() * 10000 + horaDecimalB;
          return fechaHoraEnNumeroA - fechaHoraEnNumeroB;
        });
      } else {
        return res.sort((a, b) => {
          const fechaHoraA = new Date(a.fechaReservada);
          const fechaHoraB = new Date(b.fechaReservada);
    
          const horaDecimalA = horaADecimal(a.disponibilidad.horaInicio);
          const horaDecimalB = horaADecimal(b.disponibilidad.horaInicio);
    
          const fechaHoraEnNumeroA = fechaHoraA.getTime() * 10000 + horaDecimalA;
          const fechaHoraEnNumeroB = fechaHoraB.getTime() * 10000 + horaDecimalB;
    
          return fechaHoraEnNumeroB - fechaHoraEnNumeroA;
        });
      }
    }

    const reservasFiltradas = filtrarReservas(reservas);

  return (
    <>
      <Heading pb="25px" size="lg" textAlign="center">
        Mis Reservas 
      </Heading>
      <Box mx="10%" mb="17px" justifyContent="center" display="flex" alignItems="flex-end">
        <Text mr="4px">Reservas Activas</Text>
         <Switch isChecked={estado}  onChange={handleSwitchChange} colorScheme="blackAlpha"> </Switch>
         <Text mr="4px">Ordenar</Text>
         <Switch isChecked={ordenAscendente}  onChange={handleOrdenChange} colorScheme="blackAlpha"> </Switch>
      </Box>
      <HStack wrap="wrap" align="center" justify="center">
      {reservasFiltradas
      .filter((reserva) => !estado || isFechaFutura(reserva.fechaReservada, reserva.disponibilidad.horaFin) )
      .map((reserva) => (
        <ReservaCard key={reserva.id} reserva={reserva} />
  ))}
      </HStack>
    </>
  );
}
