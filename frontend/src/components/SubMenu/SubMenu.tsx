import { useLocation } from "react-router";
import { Button, HStack, Heading, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Establecimiento } from "../../models";
import { getEstablecimientoByID } from "../../utils/api/establecimientos";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import Alerta from "../../components/Alerta/Alerta";
import { Link } from "react-router-dom";

export default function SubMenu( { canchas, nombreCancha }: { canchas: boolean; nombreCancha:string } ) {
  const { idEst, idCancha } = useParams();
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
          {establecimientoData.nombre}{" "} {nombreCancha}
        </Heading>
      )}
      <HStack spacing={0} marginLeft="15.5%" marginTop="18px" marginBottom="30px">

      {canchas ? (
          <>
            <Link to={`/ests/${establecimientoData?.id}/canchas/${idCancha}`}>
            <Button backgroundColor="white" >
              <Text
                textDecoration={sub ? "underline" : "none"}
                textDecorationThickness="3px"
                marginBottom="0px"
                textUnderlineOffset="11px"
              >
                {" "}
                Información{" "}
              </Text>
          </Button>
          </Link>
          </>
        ) : (
          <>
          <Link to={`/ests/${establecimientoData?.id}`}>
          <Button backgroundColor="white" >
          <Text
            textDecoration={sub ? "underline" : "none"}
            textDecorationThickness="3px"
            marginBottom="0px"
            textUnderlineOffset="11px"
          >
            {" "}
            Información{" "}
          </Text>

          </Button>
        </Link>
        <Link to={`/ests/${establecimientoData?.id}/canchas`}>
        <Button backgroundColor="white" >
          <Text
            textDecoration={!sub ? "underline" : "none"}
            textDecorationThickness="3px"
            marginBottom="0px"
            textUnderlineOffset="11px"
          >
            {" "}
            Canchas{" "}
          </Text>

          </Button>
        </Link>
        <Link to={`/ests/${establecimientoData?.id}/reservas`}>
        <Button backgroundColor="white" >
          <Text
            textDecoration={"none"}
            textDecorationThickness="3px"
            marginBottom="0px"
            textUnderlineOffset="11px"
          >
            {" "}
            Reservas{" "}
          </Text>

          </Button>
        </Link>
          </>
        )}
    
      </HStack>
    </>
  );
}
