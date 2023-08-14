import { useLocation } from "react-router";
import { HStack, Heading, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Establecimiento } from "../../models";
import { getEstablecimientoByID } from "../../utils/api/establecimientos";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import Alerta from "../../components/Alerta/Alerta";
import { Link } from "react-router-dom";

export default function SubMenu() {
  const { idEst } = useParams();
  const location = useLocation();
  const {
    data: establecimientoData,
    isLoading: establecimientoLoading,
    isError: establecimientoError,
  } = useQuery<Establecimiento>(["establecimiento", idEst], () =>
    getEstablecimientoByID(Number(idEst))
  );

  const [sub, setSub] = useState(true);

  useEffect(() => {
    const isInfoPage = location.pathname.endsWith("canchas");
    setSub(!isInfoPage);
  }, [location]);

  return (
    <>
      {establecimientoLoading ? (
        <LoadingSpinner />
      ) : establecimientoError ? (
        <Alerta mensaje="Ha ocurrido un error inesperado" status="error" />
      ) : (
        <Heading textAlign="center" paddingBottom="7" mt="40px">
          {" "}
          {establecimientoData.nombre}{" "}
        </Heading>
      )}
      <HStack gap="30px" marginLeft="16%" marginTop="18px" marginBottom="30px">
        <Link to={`/ests/${establecimientoData?.id}`}>
          <Text
            textDecoration={sub ? "underline" : "none"}
            textDecorationThickness="3px"
            marginBottom="0px"
            textUnderlineOffset="7px"
          >
            {" "}
            Información{" "}
          </Text>
        </Link>
        <Link to={`/ests/${establecimientoData?.id}/canchas`}>
          <Text
            textDecoration={!sub ? "underline" : "none"}
            textDecorationThickness="3px"
            marginBottom="0px"
            textUnderlineOffset="7px"
            transition="texDecoration 1s ease-in-out"
          >
            {" "}
            Canchas{" "}
          </Text>
        </Link>
        <Link to={`/establecimiento/${establecimientoData?.id}/canchas`}>
          Reservas
        </Link>
      </HStack>
    </>
  );
}
