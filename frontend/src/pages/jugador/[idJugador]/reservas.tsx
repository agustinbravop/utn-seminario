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
} from "@chakra-ui/react";
import { useCurrentJugador } from "@/hooks";
import { ReservaCard } from "@/components/display";
import { useState } from "react";
import { Reserva } from "@/models";
import { DISCIPLINAS } from "@/utils/constants";
import { fechaHoraReservada, isReservaActiva } from "@/utils/reservas";
import { LoadingSpinner } from "@/components/feedback";
import { QuestionAlert } from "@/components/media-and-icons";

function reservaCompare(a: Reserva, b: Reserva) {
  return Number(fechaHoraReservada(a)) - Number(fechaHoraReservada(b));
}

export default function JugadorReservasPage() {
  const { jugador } = useCurrentJugador();
  const { data: reservas, isFetchedAfterMount } = useReservasByJugadorID(
    jugador.id
  );
  const [orden, setOrden] = useState(true);
  const [disciplina, setDisciplina] = useState("");

  function ordenarReservas(res: Reserva[]) {
    if (orden) {
      return res.sort((a, b) => reservaCompare(b, a));
    } else {
      return res.sort((a, b) => reservaCompare(a, b));
    }
  }

  let reservasFiltradas = ordenarReservas(reservas);
  if (disciplina) {
    reservasFiltradas = reservasFiltradas.filter(
      (r) => r.disponibilidad.disciplina === disciplina
    );
  }
  const reservasActivas = reservasFiltradas.filter((reserva) =>
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
          onChange={(e) => setOrden(e.target.value === "Más recientes")}
          width="fit-content"
        >
          <option defaultChecked value="Más recientes">
            Más recientes
          </option>
          <option value="Más antiguas">Más antiguas</option>
        </Select>
        <Select
          width="fit-content"
          onChange={(e) => setDisciplina(e.target.value)}
        >
          <option defaultChecked value="">
            Disciplina
          </option>
          {DISCIPLINAS.map((dis) => (
            <option key={dis} value={dis}>
              {dis}
            </option>
          ))}
        </Select>
      </HStack>
      <Tabs mx="5vw">
        <TabList>
          <Tab>Reservas Activas</Tab>
          <Tab>Historial</Tab>
        </TabList>
        <TabPanels>
          <TabPanel display="flex" justifyContent="center" flexWrap="wrap">
            {!isFetchedAfterMount ? (
              <LoadingSpinner />
            ) : reservasActivas.length > 0 ? (
              reservasActivas.map((reserva) => (
                <ReservaCard key={reserva.id} reserva={reserva} />
              ))
            ) : (
              <QuestionAlert>No hay reservas activas por jugar.</QuestionAlert>
            )}
          </TabPanel>
          <TabPanel display="flex" justifyContent="center" flexWrap="wrap">
            {!isFetchedAfterMount ? (
              <LoadingSpinner />
            ) : reservasFiltradas.length > 0 ? (
              reservasFiltradas.map((reserva) => (
                <ReservaCard key={reserva.id} reserva={reserva} />
              ))
            ) : (
              <QuestionAlert>Todavía no ha realizado reservas.</QuestionAlert>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
