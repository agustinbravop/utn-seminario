import { useQuery } from "@tanstack/react-query";
import { Cancha, Establecimiento } from "../../models";
import { useNavigate, useParams } from "react-router";
import TopMenu from "../../components/TopMenu/TopMenu";
import { Button, HStack, Heading, Icon, Input, Text } from "@chakra-ui/react";
import Courts from "../../components/Courts/Courts";
import { getCanchasByEstablecimientoID } from "../../utils/api/canchas";
import { getEstablecimientoByID } from "../../utils/api/establecimientos";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { GrAddCircle } from "react-icons/gr";
import Alerta from "../../components/Alerta/Alerta";
import { useState } from "react";

export default function CourtPage() {
  const navigate = useNavigate();
  const { idEst } = useParams();
  const { data, isLoading, isError } = useQuery<Cancha[]>(
    ["canchas", idEst],
    () => getCanchasByEstablecimientoID(Number(idEst))
  );

  const { data: dataE, isLoading: isLoadingE, isError: isErrorE } = useQuery<Establecimiento>(
    ["establecimiento"],
    () => getEstablecimientoByID(Number(idEst))
  );

  const [filtro, setFiltro] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value);
  };

  const canchasFiltradas = data?.filter((cancha) =>
    cancha.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <TopMenu />
      <Heading textAlign="center" paddingBottom="2" mt="40px">
        Canchas de {dataE?.nombre}
      </Heading>
      <HStack align="center" spacing={4} m="20px">
        <Button
          onClick={() => navigate("nuevaCancha")}
          variant="outline"
          leftIcon={<Icon as={GrAddCircle} />}
        >
          Agregar Cancha
        </Button>
        <Text mb="0">{data?.length} canchas</Text>
        <Input
          focusBorderColor="lightblue"
          placeholder="Nombre de la Cancha"
          size="md"
          width="35%"
          onChange={handleChange}
          value={filtro}
        />
      </HStack>
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <Alerta mensaje="Ha ocurrido un error inesperado" status="error" />
      ) : (canchasFiltradas && canchasFiltradas.length > 0) ? (
          <Courts canchas={(filtro ? canchasFiltradas : data) || []} />
        ) : (
          <Text textAlign="center">No se encontraron canchas</Text>
        )
      }
    </div>
  );
}
