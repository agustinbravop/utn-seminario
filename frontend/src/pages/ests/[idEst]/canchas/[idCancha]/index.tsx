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
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useCanchaByID, useEliminarCancha } from "@/utils/api/canchas";
import { useParams } from "@/router";
import SubMenu from "@/components/SubMenu/SubMenu";
import { DEFAULT_IMAGE_SRC } from "@/utils/consts";
import React from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

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

  if (!data) {
    return <p>Cargando...</p>;
  }

  const handleEliminar = () => {
    mutateDelete({ idEst: data.idEstablecimiento, idCancha: data.id });
    onClose();
  };

  return (
    <div>
      <SubMenu canchas={true} nombreCancha={data.nombre} />
      <HStack
        marginRight="16%"
        marginLeft="16%"
        marginBottom="30px"
        marginTop="0px"
      >
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
                  src={
                    !(data?.urlImagen === null)
                      ? data?.urlImagen
                      : DEFAULT_IMAGE_SRC
                  }
                  width="1000px"
                  height="400px"
                  objectFit="cover"
                  borderRadius="10px"
                />
              </Box>

              <Box marginTop="55px" marginLeft=" 50px" height="100%">
                <Stack divider={<StackDivider />} spacing="1" marginTop="-2rem">
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Descripción
                    </Heading>
                    <Text fontSize="sm">{data.descripcion}</Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Disciplinas
                    </Heading>
                    <Text fontSize="sm">
                      {data.disciplinas.map((disciplina, index) => (
                        <React.Fragment key={index}>
                          {disciplina}
                          {index !== data.disciplinas.length - 1 && " - "}
                        </React.Fragment>
                      ))}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Habilitación
                    </Heading>
                    <Text fontSize="sm">
                      Esta cancha {data.habilitada ? "" : "no"} se encuentra
                      habilitada
                    </Text>
                  </Box>

                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Disponibilidades
                    </Heading>
                    <Text fontSize="sm">
                      Estas son las disponibilidades de la cancha.
                    </Text>

                    <TableContainer paddingTop="15px" paddingBottom="20px">
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>disciplina</Th>
                            <Th>horario</Th>
                            <Th>precio</Th>
                            <Th> dias </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {data.disponibilidades.map((d) => (
                            <Tr key={d.id}>
                              <Td> {d.disciplina} </Td>
                              <Td>
                                {d.horaInicio}- {d.horaFin}
                              </Td>
                              <Td> ${d.precioReserva} </Td>
                              <Td>
                                {d.dias.map((dia, index) => (
                                  <React.Fragment key={index}>
                                    {dia}
                                    {index !== d.dias.length - 1 && " - "}
                                  </React.Fragment>
                                ))}
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                    <Box
                      width="100%"
                      display="flex"
                      justifyContent="center"
                      alignItems="flex-end"
                    >
                      <Link to="editar">
                        <Button mt="38px" mr="40px" leftIcon={<EditIcon />}>
                          Editar
                        </Button>
                      </Link>
                      <Button
                        mt="38px"
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
    </div>
  );
}
