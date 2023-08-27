import EstablecimientoCardList from "@/components/EstablecimientoCardList/EstablecimientoCardList";
import { Navigate, useNavigate } from "react-router";
import {
  Button,
  HStack,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Establecimiento } from "@/models";
import { GrAddCircle } from "react-icons/gr";
import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import Alerta from "@/components/Alerta/Alerta";
import { DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import {
  useEstablecimientosByAdminID,
  useEstablecimientosEliminadosByAdminID,
} from "@/utils/api/establecimientos";

import DeletedEstablecimientoList from "@/components/DeletedEstablecimientoList/DeletedEstablecimientoList";

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
  const { currentAdmin } = useCurrentAdmin();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filtro, setFiltro] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value);
  };

  const { data, isLoading, isError } = useEstablecimientosByAdminID(
    Number(currentAdmin?.id)
  );

  const methods = useEstablecimientosEliminadosByAdminID(
    Number(currentAdmin?.id)
  );

  if (!currentAdmin) {
    return <Navigate to="/login" />;
  }

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
        <Button onClick={onOpen}> <Icon as={DeleteIcon} /></Button>
        <HStack
          marginLeft="auto"
          display="flex"
          alignContent="column"
          spacing={5}
          align="center"
        >
          <Text mb="0">
            {data.length} / {currentAdmin.suscripcion.limiteEstablecimientos}{" "}
            establecimiento{data?.length === 1 || "s"}
          </Text>
          {data.length < currentAdmin.suscripcion.limiteEstablecimientos && (
            <Link to="nuevoEstablecimiento">
              <Button leftIcon={<Icon as={GrAddCircle} />}>
                Agregar Establecimiento
              </Button>
            </Link>
          )}
          {data.length === currentAdmin.suscripcion.limiteEstablecimientos && (
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
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Establecimientos Eliminados</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {methods.isLoading ? (
              <LoadingSpinner />
            ) : methods.isError ? (
              <Alerta
                mensaje="Ha ocurrido un error inesperado"
                status="error"
              /> 
            ) : 
              methods.data.length === 0 ? (<Text> No hay establecimientos en la papelera </Text>):
              (
              <DeletedEstablecimientoList
                establecimientos={methods.data}
              />
            ) }
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
