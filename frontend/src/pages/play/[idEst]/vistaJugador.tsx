import { useParams } from "react-router";
import { Box, HStack, Heading } from "@chakra-ui/react";
import { useEstablecimientoByID } from "@/utils/api";
import { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import DetailEstablecimiento from "@/components/DetailEstablecimiento/DetailEstablecimiento";

export default function VistaJugador() {
  const { idEst } = useParams();

  const [activeIndex, setActiveIndex] = useState(1);

  const handleChangeIndex = (index: number) => {
    setActiveIndex(index);
  };

  const { data } = useEstablecimientoByID(Number(idEst));

  return (
    <>
      <Heading textAlign="center" pb="12" mt="40px">
        Establecimiento {data?.nombre}
      </Heading>

      <Box>
        <SwipeableViews index={activeIndex} onChangeIndex={handleChangeIndex}>
          <DetailEstablecimiento />
          <>
            <Heading textAlign="center">¡Reservá ahora!</Heading>
          </>
          <>
            <Heading>Canchas</Heading>
            <HStack
              display="flex"
              flexWrap="wrap"
              justifyContent="left"
            ></HStack>
          </>
        </SwipeableViews>
      </Box>
    </>
  );
}
