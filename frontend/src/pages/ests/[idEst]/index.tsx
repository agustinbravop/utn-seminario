import { useNavigate, useParams } from "react-router";
import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackDivider,
  Switch,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  useEliminarEstablecimiento,
  useEstablecimientoByID,
  useModificarEstablecimiento,
} from "@/utils/api/establecimientos";
import SubMenu from "@/components/SubMenu/SubMenu";
import { Image } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { DEFAULT_IMAGE_SRC } from "@/utils/consts";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export default function CourtPage() {
  const { idEst } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  const { data } = useEstablecimientoByID(Number(idEst));

  const { mutate: mutateDelete } = useEliminarEstablecimiento({
    onSuccess: () => {
      toast({
        title: "Establecimiento eliminado.",
        description: `Establecimiento eliminado exitosamente.`,
        status: "success",
        isClosable: true,
      });
      navigate(`/admin/${data?.idAdministrador}`);
    },
    onError: () => {
      toast({
        title: "Error al eliminar el establecimiento",
        description: `Intente de nuevo.`,
        status: "error",
        isClosable: true,
      });
    },
  });

  const { mutate } = useModificarEstablecimiento({
    onSuccess: () => {
      // Usa `!data?.habilitado` porque data es el valor previo al cambio del back end.
      toast({
        title: `Establecimiento ${
          !data?.habilitado ? "habilitado" : "deshabilitado"
        }.`,
        status: `${!data?.habilitado ? "info" : "warning"}`,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: `Error al ${
          data?.habilitado ? "habilitar" : "deshabilitar"
        } el establecimiento`,
        description: `Intente de nuevo.`,
        status: "error",
        isClosable: true,
      });
    },
  });

  if (!data) {
    return <LoadingSpinner />;
  }

  const handleEliminar = () => {
    mutateDelete(Number(data?.id));
    onClose();
  };

  const handleSwitchChange = () => {
    mutate({
      ...data,
      habilitado: !data.habilitado,
    });
  };

  return (
    <>
      <SubMenu />
      <HStack
        marginRight="16%"
        marginLeft="16%"
        marginBottom="30px"
        marginTop="0px"
      >
        <Text>
          Esta es la información que se muestra al usuario de su
          establecimiento.
        </Text>
        <HStack
          marginLeft="auto"
          display="flex"
          alignContent="column"
          spacing={5}
          align="center"
        ></HStack>
      </HStack>
      <Box display="flex" justifyContent="center">
        <Card
          boxSize="10rem"
          justifyContent="center"
          display="flex"
          style={{ marginTop: "10px", marginBottom: "1rem" }}
          height="75%"
          width="56%"
        >
          <CardBody height="100%" marginTop="0px">
            <Box
              display="grid"
              gridTemplateColumns="1fr 1fr"
              height="100%"
              width="100%"
            >
              <Box>
                <Image
                  src={data?.urlImagen}
                  width="1000px"
                  fallbackSrc={DEFAULT_IMAGE_SRC}
                  height="400px"
                  objectFit="cover"
                  borderRadius="10px"
                />
              </Box>

              <Box marginTop="55px" marginLeft=" 50px" height="100%">
                <Stack divider={<StackDivider />} spacing="1" marginTop="-2rem">
                  <Box>
                    <HStack
                      width="100%"
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Heading size="xs" textTransform="uppercase">
                        Habilitación
                      </Heading>
                      <Switch
                        isChecked={data.habilitado}
                        onChange={handleSwitchChange}
                      />
                    </HStack>
                    <Text fontSize="sm">
                      Este establecimiento {data.habilitado ? "" : "no"} se
                      encuentra habilitado
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Dirección
                    </Heading>
                    <Text fontSize="sm">{data?.direccion}</Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Horario de atención
                    </Heading>
                    <Text fontSize="sm">{data?.horariosDeAtencion}</Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Correo de contacto
                    </Heading>
                    <Text fontSize="sm">{data?.correo}</Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Numero de teléfono
                    </Heading>
                    <Text fontSize="sm">{data?.telefono}</Text>
                  </Box>
                  <Box height="100%">
                    <Heading size="xs" textTransform="uppercase">
                      Localidad
                    </Heading>
                    <Text fontSize="sm">
                      {data?.localidad}, {data?.provincia}
                    </Text>
                    <Box
                      width="100%"
                      pt="25%"
                      display="flex"
                      justifyContent="center"
                      alignItems="flex-end"
                    >
                      <Link to="editar">
                        <Button mr="30px" leftIcon={<EditIcon />}>
                          Editar{" "}
                        </Button>
                      </Link>
                      <Button
                        onClick={onOpen}
                        colorScheme="red"
                        leftIcon={<DeleteIcon />}
                      >
                        Eliminar
                      </Button>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </CardBody>
        </Card>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Eliminar establecimiento</ModalHeader>
            <ModalCloseButton />
            <ModalBody>¿Está seguro de eliminar el establecimiento?</ModalBody>
            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="blackAlpha"
                backgroundColor="black"
                onClick={handleEliminar}
              >
                Aceptar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
}
