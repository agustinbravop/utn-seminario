import TopMenu from "../../components/TopMenu/TopMenu";
import { Navigate, useNavigate } from "react-router";
import { Box, Button, HStack, Heading, Icon, Input, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Establecimiento } from "../../models";
import { getEstablecimientosByAdminID, getEstablecimientoByID} from "../../utils/api/establecimientos";
import { useState } from "react";
import { useParams } from "react-router";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import Alerta from "../../components/Alerta/Alerta";
import CourtPage from "../CourtPage/CourtPage";


export default function EstabPage() {
  const navigate = useNavigate();
  const { idEst } = useParams();

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


  return (
    <>
      <TopMenu />
      {establecimientoLoading ? (
          <LoadingSpinner />
        ) : establecimientoError ? (
          <Alerta mensaje="Ha ocurrido un error inesperado" status="error" />
        ) : (
          <Heading textAlign="left" marginLeft="25%" paddingBottom="2" mt="40px"> {establecimientoData.nombre} </Heading>
        )}
        <Button
            onClick={() => setSection("info")}
            variant="outline"
          >  Info </Button>
           <Button
            onClick={() => setSection("canchas")}
            variant="outline"
          >  Canchas </Button>

      {section==="canchas" ? ( <CourtPage/>):
      (<div> Informacion</div>)
      }


    </>
  );
}
