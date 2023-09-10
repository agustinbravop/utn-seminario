import { useParams } from "react-router";
import { Box, HStack, Heading, Tabs } from "@chakra-ui/react";
import { useEstablecimientoByID } from "@/utils/api/establecimientos";
import { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import DetailEstablecimiento from "@/components/DetailEstablecimiento/DetailEstablecimiento";
import { useCanchasByEstablecimientoID } from "@/utils/api/canchas";
import CanchaJugador from "@/components/CanchaJugador/CanchaJugador";
import ReservaForm from "@/components/ReservaForm/ReservaForm";

export default function VistaJugador() {
  const { idEst } = useParams();

  const [activeIndex, setActiveIndex] = useState(1);

  const handleChangeIndex = (index: number) => {
    setActiveIndex(index);
  };

  const { data } = useEstablecimientoByID(Number(idEst));
  const canchas = useCanchasByEstablecimientoID(Number(idEst));

  return (
    <>
      <Heading textAlign="center" paddingBottom="12" mt="40px">
        Establecimiento {data?.nombre}
      </Heading>

      <Box>
        <HStack justifyContent="center">
          <Tabs
            position="relative"
            variant="unstyled"
            index={activeIndex}
            onChange={handleChangeIndex}
            pb="10px"
          ></Tabs>
        </HStack>
        {/* <SwipeableViews index={activeIndex} onChangeIndex={handleChangeIndex}> */}
        {/* <DetailEstablecimiento /> */}
        {/* <>
            <Heading textAlign="center">¡Reservá ahora!</Heading>
            <ReservaForm />
          </> */}
        <Heading>Canchas</Heading>
        <HStack display="flex" flexWrap="wrap" justifyContent="center" w="330">
          {canchas.data.map(
            (c, index) =>
              c.habilitada && <CanchaJugador key={index} cancha={c} />
          )}
        </HStack>
        {/* </SwipeableViews> */}
      </Box>
    </>
  );
}