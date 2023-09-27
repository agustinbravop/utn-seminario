import { Heading } from "@chakra-ui/react";
import { useEstablecimientoByID } from "../../utils/api/establecimientos";
import { useParams } from "react-router";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Alerta from "../Alerta/Alerta";
import { useCanchaByID } from "@/utils/api";

export default function CanchaMenu() {
  const { idEst, idCancha } = useParams();

  const {
    data: cancha,
    isLoading,
    isError,
  } = useCanchaByID(Number(idEst), Number(idCancha));
  const { data: est } = useEstablecimientoByID(Number(idEst));

  if (isError) {
    return <Alerta mensaje="Ha ocurrido un error inesperado" status="error" />;
  }

  if (isLoading || !cancha || !est) {
    return <LoadingSpinner />;
  }

  return (
    <Heading textAlign="center" pb="7" mt="40px">
      {est.nombre}: {cancha.nombre}
    </Heading>
  );
}
