import {
  DeletedEstablecimiento,
  EstablecimientoCard,
} from "@/components/display";
import {
  Button,
  FormControl,
  FormLabel,
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
import { Alerta, LoadingSpinner } from "@/components/feedback";
import { DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import {
  useEstablecimientosByAdminID,
  useEstablecimientosEliminadosByAdminID,
} from "@/utils/api";

interface EstablecimientosListProps {
  data?: Establecimiento[];
  isLoading: boolean;
  isError: boolean;
}

function EstablecimientosList({ data }: EstablecimientosListProps) {
  if (data && data.length > 0) {
    return (
      <HStack flexWrap="wrap" justify="center" align="center" m="auto">
        {data.map((est) => (
          <EstablecimientoCard key={est.id} establecimiento={est} />
        ))}
      </HStack>
    );
  } else {
    return <Text textAlign="center">No se encontraron establecimientos</Text>;
  }
}

interface EstablecimientosEliminadosModalProps {
  idAdmin: number;
  establecimientosActuales: number;
}

function EstablecimientosEliminadosModal({
  idAdmin,
  establecimientosActuales,
}: EstablecimientosEliminadosModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    data: estsEliminados,
    isLoading,
    isError,
  } = useEstablecimientosEliminadosByAdminID(idAdmin);

  return (
    <>
      <Button onClick={onOpen}>
        <Icon as={DeleteIcon} />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Establecimientos Eliminados</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading ? (
              <LoadingSpinner />
            ) : isError ? (
              <Alerta mensaje="Ha ocurrido un error" status="error" />
            ) : estsEliminados.length === 0 ? (
              <Text>No hay establecimientos en la papelera</Text>
            ) : (
              <HStack display="flex" flexWrap="wrap" justifyContent="left">
                {estsEliminados.map((est) => (
                  <DeletedEstablecimiento
                    key={est.id}
                    establecimiento={est}
                    establecimientosActuales={establecimientosActuales}
                    onRecuperar={onClose}
                  />
                ))}
              </HStack>
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

export default function EstablecimientosPage() {
  const { admin } = useCurrentAdmin();

  const [filtro, setFiltro] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value);
  };

  const {
    data: establecimientos,
    isLoading,
    isError,
  } = useEstablecimientosByAdminID(Number(admin.id));

  const establecimientosFiltrados = establecimientos.filter((establecimiento) =>
    establecimiento.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <>
      <Heading textAlign="center" pb="12" mt="40px">
        Establecimientos
      </Heading>
      <HStack mr="16%" ml="16%" mb="50px" mt="20px">
        <FormControl variant="floating">
          <InputGroup width="300px">
            <InputRightElement>
              <SearchIcon color="gray" />
            </InputRightElement>
            <Input
              focusBorderColor="lightblue"
              placeholder="Nombre"
              size="md"
              onChange={handleChange}
              value={filtro}
            />
            <FormLabel>Nombre</FormLabel>
          </InputGroup>
        </FormControl>
        <HStack ml="auto" spacing={4}>
          <Text mb="0">
            {establecimientos.length} /{" "}
            {admin.suscripcion.limiteEstablecimientos} establecimiento
            {admin.suscripcion.limiteEstablecimientos === 1 || "s"}
          </Text>
          <Link
            to={
              establecimientos.length < admin.suscripcion.limiteEstablecimientos
                ? "nuevoEstablecimiento"
                : "mejorarSuscripcion"
            }
          >
            <Button leftIcon={<Icon as={GrAddCircle} />}>Agregar</Button>
          </Link>
          <EstablecimientosEliminadosModal
            establecimientosActuales={establecimientos.length}
            idAdmin={admin.id}
          />
        </HStack>
      </HStack>
      <HStack ml="16%" mr="16%">
        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <Alerta mensaje="Ha ocurrido un error inesperado" status="error" />
        ) : (
          <EstablecimientosList
            data={filtro ? establecimientosFiltrados : establecimientos}
            isLoading={isLoading}
            isError={isError}
          />
        )}
      </HStack>
    </>
  );
}
