import { Heading } from "@chakra-ui/react";
import { useEstablecimientoByID } from "../../utils/api/establecimientos";
import { useParams } from "react-router";
import LoadingSpinner from "../feedback/LoadingSpinner";
import Alerta from "../feedback/Alerta";
import { useCanchaByID } from "@/utils/api";
import { EstablecimientoBreadcrumb } from ".";

export default function CanchaMenu() {
  const { idEst, idCancha } = useParams();

  const {
    data: cancha,
    isLoading,
    isError,
  } = useCanchaByID(Number(idEst), Number(idCancha));
  const { data: est } = useEstablecimientoByID(Number(idEst));

  if (isError) {
    return <Alerta mensaje="Ha ocurrido un error " status="error" />;
  }

  if (isLoading || !cancha || !est) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <EstablecimientoBreadcrumb ml="12%" />
      <Heading textAlign="center" pb="7">
        {est.nombre}: {cancha.nombre}
      </Heading>
    </>
  );
}
