import { useQuery } from "@tanstack/react-query";
import { Cancha } from "../../models";
import { useNavigate, useParams } from "react-router";
import TopMenu from "../../components/TopMenu/TopMenu";
import { Button, HStack, Heading, Icon, Input, Text } from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import Courts from "../../components/Courts/Courts";
import { getCanchasByEstablecimientoID } from "../../utils/api/canchas";
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
  console.log(data);

  const [filtro, setFiltro] = useState('')
  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value)
    console.log(filtro)
  }

  return (
    <div>
      <TopMenu />
      <HStack spacing={4}>
        <Button
          className="btn-agregarestablecimiento"
          onClick={() => navigate("nuevaCancha")}
          variant="outline"
          leftIcon={<Icon as={GrAddCircle} />}
        >
          Cancha
        </Button>
        <Text mb="0" mt="15px">
          {data?.length} canchas
        </Text>
        <Input
          focusBorderColor="lightblue"
          placeholder="Número de la Cancha"
          size="md"
          width="35%"
          onChange={handleChange}
        />
      </HStack>
      <Heading textAlign='center' paddingBottom='2'>
         Mis Canchas
      </Heading>
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <Alerta mensaje="Ha ocurrido un error inesperado" status="error" />
      ) : (
        <Courts canchas={data || []} />
      )}
    </div>
  );
}
