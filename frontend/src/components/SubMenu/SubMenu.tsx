import { useLocation } from "react-router";
import { Button, HStack, Heading, Text } from "@chakra-ui/react";
import { useEstablecimientoByID } from "../../utils/api/establecimientos";
import { useParams } from "react-router";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import Alerta from "../../components/Alerta/Alerta";
import { Link } from "react-router-dom";

export default function SubMenu({
  canchas = false,
  nombreCancha,
}: {
  canchas?: boolean;
  nombreCancha?: string;
}) {
  const { idEst } = useParams();
  const location = useLocation();

  const {
    data: establecimiento,
    isLoading,
    isError,
  } = useEstablecimientoByID(Number(idEst));

  const shouldSubrayar = (targetPath: string) =>
    location.pathname.endsWith(targetPath);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <Alerta mensaje="Ha ocurrido un error inesperado" status="error" />
      ) : (
        <Heading textAlign="center" paddingBottom="7" mt="40px">
          {canchas
            ? `${establecimiento.nombre}: ${nombreCancha}`
            : `${establecimiento.nombre}`}
        </Heading>
      )}

      <HStack gap="12px" marginLeft="16%" marginTop="18px" marginBottom="0px">
        {canchas ? null : (
          /*<>
            <Link to={`/ests/${establecimiento?.id}/canchas/${idCancha}`}>
              <Button backgroundColor="white">
                <Text
                  textDecoration={subrayado ? "underline" : "none"}
                  textDecorationThickness="3px"
                  marginBottom="0px"
                  textUnderlineOffset="11px"
                >
                  Información
                </Text>
              </Button>
            </Link>
          </>
          */
          <>
            <Link to={`/ests/${establecimiento?.id}`}>
              <Button backgroundColor="white">
                <Text
                  textDecoration={
                    shouldSubrayar(`/${establecimiento?.id}`)
                      ? "underline"
                      : "none"
                  }
                  textDecorationThickness="3px"
                  marginBottom="0px"
                  textUnderlineOffset="11px"
                >
                  Información
                </Text>
              </Button>
            </Link>
            <Link to={`/ests/${establecimiento?.id}/canchas`}>
              <Button backgroundColor="white">
                <Text
                  textDecoration={
                    shouldSubrayar(`/${establecimiento?.id}/canchas`)
                      ? "underline"
                      : "none"
                  }
                  textDecorationThickness="3px"
                  marginBottom="0px"
                  textUnderlineOffset="11px"
                >
                  Canchas
                </Text>
              </Button>
            </Link>
            <Link to={`/ests/${establecimiento?.id}/reservas`}>
              <Button backgroundColor="white">
                <Text
                  textDecoration={
                    shouldSubrayar(`/${establecimiento?.id}/reservas`)
                      ? "underline"
                      : "none"
                  }
                  textDecorationThickness="3px"
                  marginBottom="0px"
                  textUnderlineOffset="11px"
                >
                  Reservas
                </Text>
              </Button>
            </Link>
          </>
        )}
      </HStack>
    </>
  );
}
