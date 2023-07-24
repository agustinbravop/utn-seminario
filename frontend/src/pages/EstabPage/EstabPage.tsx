import TopMenu from "../../components/TopMenu/TopMenu";
import { Navigate, useLocation, useNavigate } from "react-router";
import { Box, Button, HStack, Heading, Icon, Input, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Establecimiento } from "../../models";
import { getEstablecimientosByAdminID, getEstablecimientoByID} from "../../utils/api/establecimientos";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import Alerta from "../../components/Alerta/Alerta";
import { Link } from "react-router-dom";
import { u } from "@chakra-ui/checkbox/dist/checkbox-types-a3d7c663";


export default function EstabPage() {
  const navigate = useNavigate();
  const { idEst } = useParams();
  const location = useLocation();

const [section, setSection] = useState("canchas");

const { data: establecimientoData, isLoading: establecimientoLoading, isError: establecimientoError } = useQuery<Establecimiento>(
    ["establecimiento", idEst],
    () => getEstablecimientoByID(Number(idEst))
  );

  const [filtro, setFiltro] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value);
    console.log(filtro);
  };

  const [sub, setSub]= useState(true)

  useEffect(() => {
    const isInfoPage = location.pathname.endsWith("info");
    setSub(isInfoPage)
  }, [location]); 

  return (
    <>
      <TopMenu />
      <HStack gap="30px" marginLeft="32%" marginTop="20px">
        <Link  to={`/establecimiento/${establecimientoData?.id}/info`} >
          <Text  textDecoration={sub ? "underline" : "none"} textDecorationThickness="3px" marginBottom="0px" textUnderlineOffset="7px" > Información </Text>
          </Link>
          <Link to={`/establecimiento/${establecimientoData?.id}/canchas`}>
            <Text  textDecoration={!sub ? "underline" : "none"} textDecorationThickness="3px" marginBottom="0px" textUnderlineOffset="7px" > Canchas </Text>
          </Link>
          <Link to={`/establecimiento/${establecimientoData?.id}/canchas`}>
              Reservas
          </Link>
        </HStack>
      {establecimientoLoading ? (
          <LoadingSpinner />
        ) : establecimientoError ? (
          <Alerta mensaje="Ha ocurrido un error inesperado" status="error" />
        ) : (
          <Heading textAlign="left" marginLeft="25%" paddingBottom="7" mt="40px"> {establecimientoData.nombre} </Heading>
        )}
    </>
  );
}
