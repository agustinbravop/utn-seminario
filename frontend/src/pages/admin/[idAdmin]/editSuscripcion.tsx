import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  Icon,
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
import { BsRocket, BsShop, BsBuildings } from "react-icons/bs";
import { getSuscripciones } from "@/utils/api/auth";
import { Administrador, Suscripcion } from "@/models";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useMutationForm from "@/hooks/useMutationForm";
import { cambiarSuscripcion } from "@/utils/api/administrador";
import { ApiError } from "@/utils/api";
import { FormProvider } from "react-hook-form";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { useState } from "react";
import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { useParams } from "@/router";

const iconos = [
  <Icon as={BsShop} fill="brand.500" fontSize={90} />,
  <Icon as={BsBuildings} fill="brand.500" fontSize={90} />,
  <Icon as={BsRocket} fill="brand.500" fontSize={90} />,
];

type FormState = Administrador;




export default function SuscripcionesPage() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const {currentAdmin} = useCurrentAdmin();
  

  const { methods, mutate } = useMutationForm<
    Administrador,
    ApiError,
    FormState
  >({
    mutationFn: (admin) => cambiarSuscripcion(admin, newSus),
    onSuccess: () => {
      toast({
        title: "Perfil actualizado",
        description: `Perfil actualizado exitosamente.`, 
        status: "success",
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al intentar editar el perfil",
        description: `Intente de nuevo.`,
        status: "error",
        isClosable: true,
      });
    },
  });

  const susMethods = useQuery<Suscripcion[]>(
    ["suscripciones"],
    getSuscripciones
  );
  let cards;
  // TODO: mejorar con un LoadingIcon o un ErrorSign o algo
  if (susMethods.isLoading) {
    cards = <p>Cargando!</p>;
  }
  if (susMethods.isError) {
    cards = <p>error!</p>;
  }

  const [newSus, setNewSus] = useState<Suscripcion>({
    id: 1,
    nombre: "",
    limiteEstablecimientos: 1,
    costoMensual: 1,
  }); 

  const suscripciones = susMethods.data
    ?.sort((s1, s2) => s1.costoMensual - s2.costoMensual)
    .map((s, idx) => ({ icono: iconos[idx], ...s }));
  cards = suscripciones?.map((s) => {
    const muestra = currentAdmin?.suscripcion.id === s.id;
    return (
      <Card
        bg="light"
        key={s.id}
        color="dark"
        width="14rem"
        variant={muestra ? "filled" : "elevated"}
      >
        <CardHeader margin="auto">{s.icono}</CardHeader>
        <CardBody textAlign="center">
          <Heading size="md">{s.nombre}</Heading>
          <Text fontSize="30px" marginBottom="0px">
            ${s.costoMensual}
          </Text>
          <Text>por mes</Text>
          <Text my="10px">
            {s.limiteEstablecimientos} establecimiento
            {s.limiteEstablecimientos === 1 ? "" : "s"}
          </Text>
          {muestra ? null : (
            <SubmitButton onClick={() => setNewSus(s)}> 
              Elejir
            </SubmitButton>
          )}
        </CardBody>
      </Card>
    );
  });

  return (
    <>
      <Box marginBottom="110px" marginLeft="12%">
        <Heading size="md">Elija una nueva suscripción</Heading>
      </Box>
      <FormProvider {...methods}>
        <HStack
          justifyContent="center"
          gap="95px"
          my="50px"
          as="form"
          onSubmit={methods.handleSubmit(onOpen)}
        >
          {cards}
        </HStack>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmación</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              ¿Está seguro que quiere cambiar su suscripción?
            </ModalBody> 
            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="brand"
                backgroundColor="black"
                onClick={methods.handleSubmit((values) => mutate(values))}
              >
                Aceptar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </FormProvider>
    </>
  );
}
