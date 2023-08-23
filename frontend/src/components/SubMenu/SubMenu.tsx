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
  const { idEst, idCancha } = useParams();
  const location = useLocation();

  const {
    data: establecimiento,
    isLoading,
    isError,
  } = useEstablecimientoByID(Number(idEst));

  const subrayado = !location.pathname.endsWith("canchas");

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <Alerta mensaje="Ha ocurrido un error inesperado" status="error" />
      ) : (
        <Heading textAlign="center" paddingBottom="7" mt="40px">
          {establecimiento.nombre}: {nombreCancha}
        </Heading>
      )}

      <HStack gap="30px" marginLeft="16%" marginTop="18px" marginBottom="30px">
        {canchas ? (
          <>
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
        ) : (
          <>
            <Link to={`/ests/${establecimiento?.id}`}>
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
            <Link to={`/ests/${establecimiento?.id}/canchas`}>
              <Button backgroundColor="white">
                <Text
                  textDecoration={!subrayado ? "underline" : "none"}
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
                  textDecoration={"none"}
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
