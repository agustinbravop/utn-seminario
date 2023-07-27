import { useLocation } from "react-router";
import { HStack, Heading, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Establecimiento } from "@models";
import { getEstablecimientoByID } from "@utils/api/establecimientos";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import LoadingSpinner from "@components/LoadingSpinner/LoadingSpinner";
import Alerta from "@components/Alerta/Alerta";
import { Link } from "react-router-dom";

export default function EstabPage() {
  const { idEst } = useParams();
  const location = useLocation();

  const { data, isLoading, isError } = useQuery<Establecimiento>(
    ["establecimiento", idEst],
    () => getEstablecimientoByID(Number(idEst))
  );

  const [sub, setSub] = useState(true);

  useEffect(() => {
    const isInfoPage = location.pathname.endsWith("info");
    setSub(isInfoPage);
  }, [location]);

  return (
    <HStack gap="30px" marginLeft="32%" marginTop="20px">
      <Link to={`/establecimiento/${data?.id}/info`}>
        <Text
          textDecoration={sub ? "underline" : "none"}
          textDecorationThickness="3px"
          marginBottom="0px"
          textUnderlineOffset="7px"
        >
          Información
        </Text>
      </Link>
      <Link to={`/establecimiento/${data?.id}/canchas`}>
        <Text
          textDecoration={!sub ? "underline" : "none"}
          textDecorationThickness="3px"
          marginBottom="0px"
          textUnderlineOffset="7px"
          transition="texDecoration 1s ease-in-out"
        >
          Canchas
        </Text>
      </Link>
      <Link to={`/establecimiento/${data?.id}/canchas`}>Reservas</Link>
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <Alerta mensaje="Ha ocurrido un error inesperado" status="error" />
      ) : (
        <Heading textAlign="left" marginLeft="25%" paddingBottom="7" mt="40px">
          {data.nombre}
        </Heading>
      )}
    </HStack>
  );
}
