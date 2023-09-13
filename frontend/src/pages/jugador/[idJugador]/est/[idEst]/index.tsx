import { useParams } from "react-router";
import { Heading } from "@chakra-ui/react";
import { useEstablecimientoByID } from "@/utils/api/establecimientos";
import DetailEstablecimiento from "@/components/DetailEstablecimiento/DetailEstablecimiento";

export default function VistaJugador() {
  const { idEst } = useParams();
  const { data } = useEstablecimientoByID(Number(idEst));

  return (
    <>
      <Heading textAlign="center" mt="35px">
        {data?.nombre}
      </Heading>

      <DetailEstablecimiento />
    </>
  );
}
