import { useParams } from "react-router";
import { Box, HStack, Heading, Tabs } from "@chakra-ui/react";
import { useEstablecimientoByID } from "@/utils/api/establecimientos";
import DetailEstablecimiento from "@/components/DetailEstablecimiento/DetailEstablecimiento";

export default function VistaJugador() {
  const { idEst } = useParams();
  const { data } = useEstablecimientoByID(Number(idEst));

  return (
    <>
      <Heading textAlign="center" paddingBottom="5" mt="35px">
      {data?.nombre}
      </Heading>

      <Box>
          <DetailEstablecimiento />
      </Box>
    </>
  );
}
