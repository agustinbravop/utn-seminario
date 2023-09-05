import ReservaCardList from "@/components/ReservaCardList/ReservaCardList";
import { useCurrentJugador } from "@/hooks/useCurrentJugador";
import {
  Box,
  HStack,
  Heading,
  Tab,
  TabIndicator,
  TabList,
  Tabs,
} from "@chakra-ui/react";
import { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import PerfilPage from "./perfil";
import { useEstablecimientosPlayer } from "@/utils/api/establecimientos";
import EstablecimientoJugador from "@/components/EstablecimientoJugador/EstablecimientoJugador";

export default function JugadorPage() {
  //TODO: AGREGR A ReservaCardList LOS PROPS DEL ARRAY DE RESERVAS

  const { currentJugador } = useCurrentJugador();

  const { data } = useEstablecimientosPlayer();

  const [activeIndex, setActiveIndex] = useState(1);

  const handleChangeIndex = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <>
      <Heading textAlign="center" paddingBottom="12" mt="40px">
        ¡Bienvenido {currentJugador?.usuario}!
      </Heading>
      <Box>
        <HStack justifyContent="center">
          <Tabs
            position="relative"
            pb='15px'
            variant="unstyled"
            index={activeIndex}
            onChange={handleChangeIndex}
          >
            <TabList>
              <Tab>Perfil</Tab>
              <Tab>Reservar</Tab>
              <Tab>Establecimientos</Tab>
            </TabList>
            <TabIndicator
              mt="-1.5px"
              height="2px"
              bg="blue.500"
              borderRadius="1px"
            />
          </Tabs>
        </HStack>
        <SwipeableViews index={activeIndex} onChangeIndex={handleChangeIndex}>
          <PerfilPage />
          <ReservaCardList />
          <HStack display="flex" flexWrap="wrap" justifyContent="center">
            {data.map((est) => (
              <EstablecimientoJugador key={est.id} establecimiento={est} />
            ))}
          </HStack>
        </SwipeableViews>
      </Box>
    </>
  );
}
