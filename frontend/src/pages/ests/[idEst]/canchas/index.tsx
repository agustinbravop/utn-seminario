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
import { useCanchasByEstablecimientoID } from "@/utils/api";
import LoadingSpinner from "@/components/feedback/LoadingSpinner";
import { GrAddCircle } from "react-icons/gr";
import Alerta from "@/components/feedback/Alerta";
import { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { EstablecimientoMenu } from "@/components/navigation";
import CanchaCard from "@/components/display/CanchaCard";
import { QuestionAlert } from "@/components/media-and-icons";

export default function EstablecimientoCanchasPage() {
  const { idEst } = useParams();
  const [filtro, setFiltro] = useState("");
  const { data, isLoading, isFetchedAfterMount, isError } =
    useCanchasByEstablecimientoID(Number(idEst));

  const canchas = data.filter((cancha) =>
    cancha.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Box mr="12%" ml="12%">
      <EstablecimientoMenu />
      <HStack mb="50px" mt="0px">
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
      {isError ? (
        <Alerta
          mensaje="Error inesperado. No podemos listar las canchas"
          status="error"
        />
      ) : isLoading ? (
        <LoadingSpinner />
      ) : canchas.length === 0 && isFetchedAfterMount ? (
        <QuestionAlert m="auto">
          {filtro
            ? "No hay canchas con ese nombre."
            : "Este establecimiento no tiene canchas."}
        </QuestionAlert>
      ) : (
        <HStack display="flex" flexWrap="wrap" gap={8} justifyContent="center">
          {canchas.map((cancha, index) => (
            <CanchaCard key={index} cancha={cancha} />
          ))}
        </HStack>
      )}
    </Box>
  );
}
