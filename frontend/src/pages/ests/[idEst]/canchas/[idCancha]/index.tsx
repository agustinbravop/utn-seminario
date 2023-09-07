import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  Image,
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
import { Link, useNavigate } from "react-router-dom";
import {
  useCanchaByID,
  useEliminarCancha,
  useModificarCancha,
} from "@/utils/api/canchas";
import { useParams } from "@/router";
import SubMenu from "@/components/SubMenu/SubMenu";
import { FALLBACK_IMAGE_SRC } from "@/utils/consts";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { GrSchedules } from "react-icons/gr";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export default function CanchaInfoPage() {
  const { idEst, idCancha } = useParams("/ests/:idEst/canchas/:idCancha");

  const { data } = useCanchaByID(Number(idEst), Number(idCancha));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  const { mutate: mutateDelete } = useEliminarCancha({
    onSuccess: () => {
      toast({
        title: "Cancha Eliminada.",
        description: `Cancha Eliminada exitosamente.`,
        status: "success",
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al eliminar la cancha",
        description: `Intente de nuevo.`,
        status: "error",
        isClosable: true,
      });
    },
  });

  const { mutate } = useModificarCancha({
    onSuccess: () => {
      toast({
        title: `Cancha ${!data?.habilitada ? "habilitada" : "deshabilitada"}.`,
        status: `${!data?.habilitada ? "info" : "warning"}`,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: `Error al ${
          !data?.habilitada ? "habilitar" : "deshabilitar"
        } la cancha`,
        description: `Intente de nuevo.`,
        status: "error",
        isClosable: true,
      });
    },
  });

  if (!data) {
    return <LoadingSpinner />;
  }

  const handleSwitchChange = () => {
    mutate({ ...data, habilitada: !data.habilitada });
  };

  const handleEliminar = () => {
    mutateDelete({ idEst: data.idEstablecimiento, idCancha: data.id });
    onClose();
  };

  return (
    <>
      <SubMenu canchas={true} nombreCancha={data.nombre} />
      <HStack mr="16%" ml="16%" mb="30px" mt="0px">
        <Text>
          Esta es la información que se muestra al usuario de su cancha.
        </Text>
      </HStack>
      <Box display="flex" justifyContent="center">
        <Card
          boxSize="10rem"
          justifyContent="center"
          display="flex"
          style={{ marginTop: "10px", marginBottom: "1rem" }}
          height="75%"
          width="76%"
        >
          <CardBody height="100%" marginTop="0px">
            <Box
              display="grid"
              gridTemplateColumns="1fr 1fr"
              height="100%"
              width="100%"
            >
              <Image
                src={data?.urlImagen}
                fallbackSrc={FALLBACK_IMAGE_SRC}
                maxWidth="20vw"
                height="400px"
                objectFit="cover"
                borderRadius="10px"
              />

              <Box marginTop="55px" marginLeft=" 50px" height="100%">
                <Stack divider={<StackDivider />} spacing="1" marginTop="-2rem">
                  <Box>
                    <HStack
                      width="100%"
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Heading size="xs">Habilitación</Heading>
                      <Switch
                        isChecked={data.habilitada}
                        onChange={handleSwitchChange}
                      />
                    </HStack>
                    <Text fontSize="sm">
                      Esta cancha {data.habilitada ? "" : "no"} se encuentra
                      habilitada
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs">Descripción</Heading>
                    <Text fontSize="sm">{data.descripcion}</Text>
                  </Box>
                  <Box>
                    <Heading size="xs">Disciplinas</Heading>
                    <Text fontSize="sm">
                      {[...new Set(data.disciplinas)].join(" - ")}
                    </Text>
                  </Box>

                  <Box>
                    <HStack justifyContent="center" mt="1em" spacing="1.5em">
                      <Link to="disps">
                        <Button leftIcon={<GrSchedules />}>
                          Disponibilidades
                        </Button>
                      </Link>
                      <Link to="editar">
                        <Button leftIcon={<EditIcon />}>Editar</Button>
                      </Link>
                      <Button
                        onClick={onOpen}
                        colorScheme="red"
                        leftIcon={<DeleteIcon />}
                      >
                        Eliminar
                      </Button>
                    </HStack>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </CardBody>
        </Card>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Eliminar cancha</ModalHeader>
          <ModalCloseButton />
          <ModalBody>¿Está seguro de eliminar la cancha?</ModalBody>
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
    </>
  );
}
