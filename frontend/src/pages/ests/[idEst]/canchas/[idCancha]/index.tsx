import { useQuery } from "@tanstack/react-query";
import { Cancha } from "@/models";
import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  Image,
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
  Stack,
  StackDivider,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { deleteCanchaByID, getCanchaByID } from "@/utils/api/canchas";
import { useParams } from "@/router";
import SubMenu from "@/components/SubMenu/SubMenu";
import { ApiError } from "@/utils/api";
import { useMutation} from "@tanstack/react-query";

export default function CourtInfoPage() {
  const { idEst, idCancha } = useParams("/ests/:idEst/canchas/:idCancha");

  const { data } = useQuery<Cancha>(["canchas", idCancha], () =>
    getCanchaByID(Number(idEst), Number(idCancha))
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  const { mutate: mutateDelete } = useMutation<Cancha, ApiError>({
    mutationFn: () => deleteCanchaByID(data?.idEstablecimiento, data?.id),
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

  const handleEliminar = () => {
    console.log("hola")
    mutateDelete()
    onClose();
  };

  return (
    <div>
      <SubMenu/>
      <Heading size="md" fontSize="26px" textAlign="left" marginLeft="16%" marginTop="20px" > Información de {data?.nombre} </Heading>
      <HStack marginRight="16%" marginLeft="16%" marginBottom="30px"marginTop="7px" >
            <Text>Esta es la información que se muestra al usuario de su cancha.</Text>
            <HStack marginLeft="auto"  display="flex" alignContent="column" spacing={5} align="center" >
            <Link to="editar">
              <Button leftIcon={<EditIcon />}>Editar</Button>
            </Link>
            <Button onClick={onOpen} colorScheme="red" leftIcon={<DeleteIcon />}>Eliminar</Button>
            </HStack> 
            </HStack>
      <Box
      display="flex"
      justifyContent="center"
    >
        <Card
        boxSize="10rem"
        justifyContent="center"
        display="flex"
        style={{ marginTop:"10px", marginBottom: "1rem" }}
        height="75%"
        width="56%"
        >
          <CardBody height="100%" marginTop="0px">
            <Box display="grid" gridTemplateColumns="1fr 1fr" height="100%">
              <Box>
                <Image
                  src={data?.urlImagen}
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
                    <Text fontSize="sm">{data?.descripcion}</Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Disciplinas
                    </Heading>
                    <Text fontSize="sm">{data?.disciplinas}</Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Habilitación
                    </Heading>
                    <Text fontSize="sm">Esta cancha { data?.estaHabilitada ? "" : "no" } se encuentra habilitada</Text>
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
