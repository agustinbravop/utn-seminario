import { useParams } from "react-router";
import { Box, HStack, Heading, Tabs } from "@chakra-ui/react";
import { useEstablecimientoByID } from "@/utils/api/establecimientos";
import { useState } from "react";
import { useCanchasByEstablecimientoID } from "@/utils/api/canchas";
import CanchaJugador from "@/components/EstablecimientosJugador/CanchaJugador";
import { useLocation } from "react-router";
import { formatearFecha } from "@/utils/dates";


export default function VistaJugador() {
  const { idEst } = useParams();
  const { data } = useEstablecimientoByID(Number(idEst));
  const canchas = useCanchasByEstablecimientoID(Number(idEst));

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const date = formatearFecha(searchParams.get("date"));

  return (
    <>
      <Heading textAlign="center" paddingBottom="12" mt="40px">
        Establecimiento {data?.nombre}
      </Heading>
      <Box>
        <HStack justifyContent="center">
        </HStack>
        <Heading>Canchas</Heading>
        <HStack display="flex" flexWrap="wrap" justifyContent="center" w="330">
          {canchas.data.map(
            (c, index) =>
               <CanchaJugador key={index} cancha={c} date={date} />
          )}
        </HStack>
      </Box>
    </>
  );
}