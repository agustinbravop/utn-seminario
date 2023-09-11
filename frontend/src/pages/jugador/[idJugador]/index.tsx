import { useCurrentJugador } from "@/hooks/useCurrentJugador";
import { Box, HStack, Heading, TabIndicator, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import SearchEstab from "@/pages/search/searchEstab";

export default function JugadorPage() {
  //TODO: AGREGR A ReservaCardList LOS PROPS DEL ARRAY DE RESERVAS

  const currentJugador = useCurrentJugador();

  const [activeIndex, setActiveIndex] = useState(0);

  const handleChangeIndex = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <>
      <Box>
        <HStack justifyContent="center">
          <Tabs
            position="relative"
            pb="15px"
            variant="unstyled"
            index={activeIndex}
            onChange={handleChangeIndex}
          ></Tabs>
        </HStack>
          <SearchEstab />
      </Box>
    </>
  );
}

