import EstablecimientoCardList from "@/components/EstablecimientoCardList/EstablecimientoCardList";
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
import { Establecimiento } from "@/models";
import { GrAddCircle } from "react-icons/gr";
import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import Alerta from "@/components/Alerta/Alerta";
import { SearchIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useEstablecimientosByAdminID } from "@/utils/api/establecimientos";

interface EstablecimientosListProps {
  data?: Establecimiento[];
  isLoading: boolean;
  isError: boolean;
}

function EstablecimientosList({ data }: EstablecimientosListProps) {
  if (data && data.length > 0) {
    return <EstablecimientoCardList establecimientos={data} />;
  } else {
    return <Text textAlign="center">No se encontraron establecimientos</Text>;
  }
}

export default function EstablecimientosPage() {
  const { admin } = useCurrentAdmin();

  const [filtro, setFiltro] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value);
  };

  const { data, isLoading, isError } = useEstablecimientosByAdminID(
    Number(admin.id)
  );

  const establecimientosFiltrados = data.filter((establecimiento) =>
    establecimiento.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <>
      <Heading textAlign="center" paddingBottom="12" mt="40px">
        Establecimientos
      </Heading>
      <HStack
        marginRight="16%"
        marginLeft="16%"
        marginBottom="50px"
        marginTop="20px"
      >
        <InputGroup width="300px">
          <InputRightElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputRightElement>
          <Input
            focusBorderColor="lightblue"
            placeholder="Nombre del establecimiento"
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
            {data.length} / {admin.suscripcion.limiteEstablecimientos}{" "}
            establecimiento{data?.length === 1 || "s"}
          </Text>
          {data.length < admin.suscripcion.limiteEstablecimientos && (
            <Link to="nuevoEstablecimiento">
              <Button leftIcon={<Icon as={GrAddCircle} />}>
                Agregar Establecimiento
              </Button>
            </Link>
          )}
          {data.length === admin.suscripcion.limiteEstablecimientos && (
            <Link to="mejorarSuscripcion">
              <Button leftIcon={<Icon as={GrAddCircle} />}>
                Agregar Establecimiento
              </Button>
            </Link>
          )}
        </HStack>
      </HStack>
      <HStack marginLeft="16%" marginRight="16%">
        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <Alerta mensaje="Ha ocurrido un error inesperado" status="error" />
        ) : (
          <EstablecimientosList
            data={filtro ? establecimientosFiltrados : data}
            isLoading={isLoading}
            isError={isError}
          />
        )}
      </HStack>
    </>
  );
}
