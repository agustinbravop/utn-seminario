import { useParams } from "react-router";
import { Box, HStack, Heading } from "@chakra-ui/react";
import { useEstablecimientoByID } from "@/utils/api";
import { useCanchasByEstablecimientoID } from "@/utils/api";
import { CanchaJugador } from "@/components/display";
import { useLocation } from "react-router";
import { formatearFecha } from "@/utils/dates";

export default function VistaJugador() {
  const { idEst } = useParams();
  const { data } = useEstablecimientoByID(Number(idEst));
  const canchas = useCanchasByEstablecimientoID(Number(idEst));

  const location = useLocation();
  const dateParam = new URLSearchParams(location.search).get("date");
  const date = formatearFecha(dateParam ? new Date(dateParam) : new Date());

  return (
    <>
      <Heading textAlign="center" pb="12" mt="40px">
        Establecimiento {data?.nombre}
      </Heading>
      <Box>
        <HStack justifyContent="center"></HStack>
        <Heading>Canchas</Heading>
        <HStack display="flex" flexWrap="wrap" justifyContent="center" w="330">
          {canchas.data.map((c, index) => (
            <CanchaJugador key={index} cancha={c} date={date} />
          ))}
        </HStack>
      </Box>
    </>
  );
}
