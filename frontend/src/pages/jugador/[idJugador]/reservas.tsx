import { useReservasByJugadorID } from "@/utils/api";
import {
  HStack,
  Heading,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCurrentJugador } from "@/hooks";
import { ReservaCard } from "@/components/display";
import { useState } from "react";
import { horaADecimal } from "@/utils/dates";
import { Reserva } from "@/models";
import { QuestionImage } from "@/utils/constants";

function isReservaActiva(reserva: Reserva) {
  const reservaDate = new Date(reserva.fechaReservada);
  const [hora, minutos] = reserva.disponibilidad.horaFin.split(":");
  reservaDate.setHours(Number(hora), Number(minutos), 0, 0);
  const currentDate = new Date();
  return reservaDate >= currentDate;
}

export default function JugadorReservasPage() {
  const { jugador } = useCurrentJugador();
  const { data: reservas } = useReservasByJugadorID(jugador.id);
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  function ordenarReservas(res: Reserva[]) {
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

  const [selectedValue, setSelectedValue] = useState("Más recientes");
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.value;
    if (selectedOption === "Más recientes") {
      setOrdenAscendente(false);
    } else {
      setOrdenAscendente(true);
    }
    setSelectedValue(selectedOption);
  };
  const reservasOrdenadas = ordenarReservas(reservas);
  const reservasActivas = reservasOrdenadas.filter((reserva) =>
    isReservaActiva(reserva)
  );

  return (
    <>
      <Heading pb="25px" size="lg" textAlign="center">
        Mis Reservas
      </Heading>
      <HStack
        mx="10%"
        mb="17px"
        justifyContent="flex-start"
        alignItems="center"
        display="flex"
        spacing="10px"
      >
        <Text>Ordenar por:</Text>
        <Select
          value={selectedValue}
          onChange={handleSelectChange}
          width="170px"
        >
          <option value="Más recientes">Más recientes</option>
          <option value="Más antiguas">Más antiguas</option>
        </Select>
      </HStack>
      <Tabs mx="5vw">
        <TabList>
          <Tab>Reservas Activas</Tab>
          <Tab>Historial</Tab>
        </TabList>
        <TabPanels>
          <TabPanel display="flex" justifyContent="center" flexWrap="wrap">
            {reservasActivas.length > 0 ? (
              reservasActivas.map((reserva) => (
                <ReservaCard key={reserva.id} reserva={reserva} />
              ))
            ) : (
              <VStack>
                <QuestionImage />
                <Text>No hay reservas activas por jugar.</Text>
              </VStack>
            )}
          </TabPanel>
          <TabPanel display="flex" justifyContent="center" flexWrap="wrap">
            {reservasOrdenadas.length > 0 ? (
              reservasOrdenadas.map((reserva) => (
                <ReservaCard key={reserva.id} reserva={reserva} />
              ))
            ) : (
              <VStack>
                <QuestionImage />
                <Text>Todavía no ha realizado reservas.</Text>
              </VStack>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
