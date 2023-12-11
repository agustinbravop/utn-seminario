import { useParams } from "react-router";
import { Box, HStack, Heading } from "@chakra-ui/react";
import { useEstablecimientoByID } from "@/utils/api";
import { useCanchasByEstablecimientoID } from "@/utils/api";
import { CanchaCardJugador } from "@/components/display";
import { useLocation } from "react-router";
import { formatFecha } from "@/utils/dates";

export default function VistaJugador() {
  const { idEst } = useParams();
  const { data } = useEstablecimientoByID(Number(idEst));
  const canchas = useCanchasByEstablecimientoID(Number(idEst));

  const { search } = useLocation();
  const fecha =
    new URLSearchParams(search).get("fecha") ?? formatFecha(new Date());

  return (
    <>
      <Heading textAlign="center" pb="12" mt="40px">
        Establecimiento {data?.nombre}
      </Heading>
      <Box>
        <HStack justify="center"></HStack>
        <Heading>Canchas</Heading>
        <HStack display="flex" flexWrap="wrap" justify="center" w="330">
          {canchas.data.map((c, index) => (
            <CanchaCardJugador key={index} cancha={c} fecha={fecha} />
          ))}
        </HStack>
      </Box>
    </>
  );
}
