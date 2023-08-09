import { useQuery } from "@tanstack/react-query";
import { Establecimiento } from "@/models";
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
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  deleteEstablecimientoByID,
  getEstablecimientoByID,
} from "@/utils/api/establecimientos";
import SubMenu from "@/components/SubMenu/SubMenu";
import { Image } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { ApiError } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { defImage } from "@/utils/const/const";

export default function CourtPage() {
  const { idEst } = useParams();

  const { data } = useQuery<Establecimiento>(["establecimientos", idEst], () =>
    getEstablecimientoByID(Number(idEst))
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  const { mutate: mutateDelete } = useMutation<Establecimiento, ApiError, void>(
    {
      mutationFn: () => deleteEstablecimientoByID(data?.id),
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
    }
  );

  const handleEliminar = () => {
    mutateDelete();
    onClose();
  };
  return (
    <>
      <SubMenu />
      <Heading
        size="md"
        fontSize="26px"
        textAlign="left"
        marginLeft="16%"
        marginTop="20px"
      >
        {" "}
        Información{" "}
      </Heading>
      <HStack
        marginRight="16%"
        marginLeft="16%"
        marginBottom="30px"
        marginTop="7px"
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
        >
          <Link to="editar">
            <Button leftIcon={<EditIcon />}>Editar </Button>
          </Link>
          <Button onClick={onOpen} colorScheme="red" leftIcon={<DeleteIcon />}>
            Eliminar
          </Button>
        </HStack>
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
            <Box display="grid" gridTemplateColumns="1fr 1fr" height="100%">
              <Box>
                <Image
                  src={!(data?.urlImagen === null) ? data?.urlImagen : defImage}
                  width="1000px"
                  height="400px"
                  objectFit="cover"
                  borderRadius="10px"
                />
              </Box>

              <Box marginTop="70px" marginLeft=" 50px" height="100%">
                <Stack divider={<StackDivider />} spacing="1" marginTop="-2rem">
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Dirección
                    </Heading>
                    <Text fontSize="sm">{data?.direccion}</Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Horario atencion
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
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Localidad
                    </Heading>
                    <Text fontSize="sm">
                      {data?.localidad}, {data?.provincia}
                    </Text>
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
