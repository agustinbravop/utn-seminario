import { useQuery } from "@tanstack/react-query";
import { Cancha, Establecimiento } from "../../models";
import { useNavigate, useParams } from "react-router";
import {
  Button,
  HStack,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import Courts from "../../components/Courts/Courts";
import { getCanchasByEstablecimientoID } from "../../utils/api/canchas";
import { getEstablecimientoByID } from "../../utils/api/establecimientos";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { GrAddCircle } from "react-icons/gr";
import Alerta from "../../components/Alerta/Alerta";
import { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import EstabPage from "../EstabPage/EstabPage";

export default function CourtPage() {
  const navigate = useNavigate();
  const { idEst } = useParams();
  const { data, isLoading, isError } = useQuery<Cancha[]>(
    ["canchas", idEst],
    () => getCanchasByEstablecimientoID(Number(idEst))
  );

  useQuery<Establecimiento>(["establecimiento", idEst], () =>
    getEstablecimientoByID(Number(idEst))
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
      <EstabPage />
      <Heading
        size="md"
        fontSize="26px"
        textAlign="left"
        marginLeft="18%"
        mt="20px"
      >
        {" "}
        Canchas{" "}
      </Heading>
      <HStack
        marginRight="auto"
        marginLeft="18%"
        marginBottom="50px"
        marginTop="20px"
      >
        <InputGroup width="18%">
          <InputRightElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputRightElement>
          <Input
            focusBorderColor="lightblue"
            placeholder="Nombre de la cancha"
            size="md"
            width="100%"
            onChange={handleChange}
            value={filtro}
          />
        </InputGroup>
        <HStack
          marginLeft="auto"
          marginRight="10%"
          display="flex"
          alignContent="column"
          spacing={5}
          align="center"
        >
          <Text mb="0">{data?.length} canchas</Text>
          <Button
            onClick={() => navigate("nuevaCancha")}
            leftIcon={<Icon as={GrAddCircle} />}
          >
            Agregar Cancha
          </Button>
        </HStack>
      </HStack>
      <HStack marginLeft="18%">
        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <Alerta mensaje="Ha ocurrido un error inesperado" status="error" />
        ) : canchasFiltradas && canchasFiltradas.length > 0 ? (
          <Courts canchas={(filtro ? canchasFiltradas : data) || []} />
        ) : (
          <Text textAlign="center">No se encontraron canchas</Text>
        )}
      </HStack>
    </div>
  );
}
