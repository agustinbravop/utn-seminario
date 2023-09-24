import EstablecimientoCardList from "@/components/EstablecimientoCardList/EstablecimientoCardList";
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { admin } = useCurrentAdmin();

  const [filtro, setFiltro] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value);
  };

  const { data, isLoading, isError } = useEstablecimientosByAdminID(
    Number(admin.id)
  );

  const methods = useEstablecimientosEliminadosByAdminID(Number(admin.id));

  const establecimientosFiltrados = data.filter((establecimiento) =>
    establecimiento.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <>
      <Heading textAlign="center" pb="12" mt="40px">
        Establecimientos
      </Heading>
      <HStack mr="16%" ml="16%" mb="50px" mt="20px">
        <InputGroup width="300px">
          <InputRightElement>
            <SearchIcon color="gray.300" />
          </InputRightElement>
          <Input
            focusBorderColor="lightblue"
            placeholder="Nombre"
            size="md"
            onChange={handleChange}
            value={filtro}
          />
        </InputGroup>
        <HStack ml="auto" spacing={4}>
          <Text mb="0">
            {data.length} / {admin.suscripcion.limiteEstablecimientos}{" "}
            establecimiento{data?.length === 1 || "s"}
          </Text>
          <Link
            to={
              data.length < admin.suscripcion.limiteEstablecimientos
                ? "nuevoEstablecimiento"
                : "mejorarSuscripcion"
            }
          >
            <Button leftIcon={<Icon as={GrAddCircle} />}>Agregar</Button>
          </Link>
          <Button onClick={onOpen}>
            <Icon as={DeleteIcon} />
          </Button>
        </HStack>
      </HStack>
      <HStack ml="16%" mr="16%">
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
            ) : methods.data.length === 0 ? (
              <Text>No hay establecimientos en la papelera</Text>
            ) : (
              <DeletedEstablecimientoList
                establecimientos={methods.data}
                establecimientosActuales={data?.length}
                onRecuperar={onClose}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
