import { useReservasByJugadorID } from "@/utils/api";
import { Box, HStack, Heading, Select, Switch, Text } from "@chakra-ui/react";
import { useCurrentJugador } from "@/hooks";
import { ReservaCard } from "@/components/display";
import { useState } from "react";
import { horaADecimal } from "@/utils/dates";
import { Reserva } from "@/models";

export default function JugadorReservasPage() {
  const { jugador } = useCurrentJugador();
  const { data: reservas } = useReservasByJugadorID(jugador.id);
  
  function isFechaFutura(fecha: string, horaFin: string) {
    const reservaDate = new Date(fecha);
    const [hora, minutos] = horaFin.split(":");
    reservaDate.setHours(Number(hora), Number(minutos), 0, 0)
    const currentDate = new Date();
    return (
      reservaDate >= currentDate)
  }

  const [activas, setActivas] = useState(true);

  function handleActivasChange() {
    setActivas(!activas)
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

    const [selectedValue, setSelectedValue] = useState("");
    const handleSelectChange = (event: any) => {
      const selectedOption = event.target.value;
      if (selectedOption === "Más recientes") {
       setOrdenAscendente(true);
      } else {
        setOrdenAscendente(false);
      }
      setSelectedValue(selectedOption)
    };
    const reservasFiltradas = filtrarReservas(reservas);

  return ( 
    <>
      <Heading pb="25px" size="lg" textAlign="center">
        Mis Reservas 
      </Heading>
      <HStack mx="10%" mb="17px" justifyContent="center"  alignItems="center" display="flex"  spacing="10px">
        <Text mr="4px">Reservas Activas</Text>
         <Switch isChecked={activas}  onChange={handleActivasChange} colorScheme="blackAlpha"> </Switch>
         <Select placeholder='Ordenar' value={selectedValue} onChange={handleSelectChange} width="170px">
          <option value='Más recientes'> Más recientes</option>
          <option value='Más antiguas'> Más antiguas </option>
        </Select>
      </HStack>
      <HStack wrap="wrap" align="center" justify="center">
      {reservasFiltradas
      .filter((reserva) => !activas || isFechaFutura(reserva.fechaReservada, reserva.disponibilidad.horaFin) )
      .map((reserva) => (
        <ReservaCard key={reserva.id} reserva={reserva} />
  ))}
      </HStack>
    </>
  );
}