import { useReservasByJugadorID } from "@/utils/api";
import {
  HStack,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useCurrentJugador, useYupForm } from "@/hooks";
import { ReservaCard } from "@/components/display";
import { Reserva } from "@/models";
import { DISCIPLINAS } from "@/utils/constants";
import { fechaHoraReservada, isReservaActiva } from "@/utils/reservas";
import { LoadingSpinner } from "@/components/feedback";
import { QuestionAlert } from "@/components/media-and-icons";
import { SelectControl } from "@/components/forms";
import { FormProvider, useWatch } from "react-hook-form";

function reservaCompare(a: Reserva, b: Reserva) {
  return Number(fechaHoraReservada(a)) - Number(fechaHoraReservada(b));
}

type Filtros = {
  orden: "Recientes" | "Antiguas";
  disciplina: string;
};

export default function JugadorReservasPage() {
  const { jugador } = useCurrentJugador();
  const { data: reservas, isFetched } = useReservasByJugadorID(jugador.id);
  const methods = useYupForm<Filtros>({
    defaultValues: { orden: "Recientes" },
  });
  const { orden, disciplina } = useWatch({ control: methods.control });

  function ordenarReservas(res: Reserva[]) {
    if (orden === "Recientes") {
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
  const reservasActivas = reservasFiltradas
    .filter((reserva) => isReservaActiva(reserva))
    .filter((reserva) => !reserva.cancelada)
    .reverse();
  const historial = reservasFiltradas.filter(
    (res) => !isReservaActiva(res) || res.cancelada
  );

  return (
    <>
      <Heading pb="25px" size="lg" textAlign="center">
        Mis Reservas
      </Heading>
      <FormProvider {...methods}>
        <HStack
          mx="10%"
          mb="17px"
          justifyContent="flex-start"
          alignItems="center"
          display="flex"
          spacing="10px"
        >
          <Text>Ordenar por:</Text>
          <SelectControl name="orden" label="Orden" width="fit-content">
            <option value="Recientes">Recientes</option>
            <option value="Antiguas">Antiguas</option>
          </SelectControl>
          <SelectControl
            width="fit-content"
            label="Disciplina"
            name="disciplina"
          >
            <option defaultChecked value="">
              Todas
            </option>
            {DISCIPLINAS.map((dis) => (
              <option key={dis} value={dis}>
                {dis}
              </option>
            ))}
          </SelectControl>
        </HStack>
      </FormProvider>
      <Tabs mx="5vw">
        <TabList>
          <Tab>Reservas Activas</Tab>
          <Tab>Historial</Tab>
        </TabList>
        <TabPanels>
          <TabPanel display="flex" justifyContent="center" flexWrap="wrap">
            {!isFetched ? (
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
            {!isFetched ? (
              <LoadingSpinner />
            ) : historial.length > 0 ? (
              historial.map((reserva) => (
                <ReservaCard key={reserva.id} reserva={reserva} />
              ))
            ) : (
              <QuestionAlert>No tiene reservas anteriores.</QuestionAlert>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
