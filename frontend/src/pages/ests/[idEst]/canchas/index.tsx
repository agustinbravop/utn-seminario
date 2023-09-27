import { useParams } from "react-router";
import {
  Box,
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
import { QuestionImage } from "@/utils/consts";

export default function EstablecimientoCanchasPage() {
  const { idEst } = useParams();
  const [filtro, setFiltro] = useState("");
  const { data, isLoading, isFetchedAfterMount, isError } =
    useCanchasByEstablecimientoID(Number(idEst));

  const canchas = data.filter((cancha) =>
    cancha.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <>
      <EstablecimientoMenu />
      <HStack mr="16%" ml="16%" mb="50px" mt="0px">
        <InputGroup width="300px">
          <InputRightElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputRightElement>
          <Input
            focusBorderColor="lightblue"
            placeholder="Nombre de la cancha"
            size="md"
            width="100%"
            onChange={(e) => setFiltro(e.target.value)}
            value={filtro}
          />
        </InputGroup>
        <HStack ml="auto" spacing={5}>
          <Text mb="0">
            {data?.length} cancha{data?.length === 1 || "s"}
          </Text>
          <Link to="nueva">
            <Button leftIcon={<Icon as={GrAddCircle} />}>Agregar Cancha</Button>
          </Link>
        </HStack>
      </HStack>
      <HStack ml="16%" mr="16%">
        {isError ? (
          <Alerta
            mensaje="Error inesperado. No podemos listar las canchas"
            status="error"
          />
        ) : isLoading ? (
          <LoadingSpinner />
        ) : canchas.length === 0 && isFetchedAfterMount ? (
          <Box m="auto">
            <QuestionImage />
            <Text>Este establecimiento no tiene canchas</Text>
          </Box>
        ) : (
          <Courts canchas={(filtro ? canchas : data) || []} />
        )}
      </HStack>
    </>
  );
}
