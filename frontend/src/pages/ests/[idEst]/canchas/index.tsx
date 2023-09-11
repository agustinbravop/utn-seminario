import { useParams } from "react-router";
import {
  Button,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import Courts from "@/components/Courts/Courts";
import { useCanchasByEstablecimientoID } from "@/utils/api/canchas";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { GrAddCircle } from "react-icons/gr";
import Alerta from "@/components/Alerta/Alerta";
import { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { EstablecimientoMenu } from "@/components/navigation";

export default function EstablecimientoCanchasPage() {
  const { idEst } = useParams();
  const { data, isLoading, isError } = useCanchasByEstablecimientoID(
    Number(idEst)
  );

  const [filtro, setFiltro] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value);
  };

  const canchasFiltradas = data.filter((cancha) =>
    cancha.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <>
      <EstablecimientoMenu />
      <HStack
        marginRight="16%"
        marginLeft="16%"
        marginBottom="50px"
        marginTop="0px"
      >
        <InputGroup width="300px">
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
          display="flex"
          alignContent="column"
          spacing={5}
          align="center"
        >
          <Text mb="0">
            {data?.length} cancha{data?.length === 1 || "s"}
          </Text>
          <Link to="nueva">
            <Button leftIcon={<Icon as={GrAddCircle} />}>Agregar Cancha</Button>
          </Link>
        </HStack>
      </HStack>
      <HStack marginLeft="16%" marginRight="16%">
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
    </>
  );
}
