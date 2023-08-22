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
import { useSuscripciones } from "@/utils/api/auth";
import { Administrador, Suscripcion } from "@/models";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { cambiarSuscripcion } from "@/utils/api/administrador";
import { ApiError } from "@/utils/api";
import { SubmitButton } from "@/components/forms";
import { useState } from "react";
import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";

const iconos = [
  <Icon as={BsShop} fill="brand.500" fontSize={90} />,
  <Icon as={BsBuildings} fill="brand.500" fontSize={90} />,
  <Icon as={BsRocket} fill="brand.500" fontSize={90} />,
];

export default function SuscripcionesPage() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { currentAdmin } = useCurrentAdmin();

  if (!currentAdmin) {
    navigate("login");
    return;
  }
  const { mutate } = useMutation<Administrador, ApiError, { idSus: number }>({
    mutationFn: ({ idSus }) => cambiarSuscripcion(currentAdmin.id, idSus),
    onSuccess: () => {
      toast({
        title: "Nueva Suscripción",
        description: `Suscripción actualizada exitosamente.`,
        status: "success",
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al intentar cambiar de suscripción",
        description: `Intente de nuevo.`,
        status: "error",
        isClosable: true,
      });
    },
  });

  const { data, isError, isLoading } = useSuscripciones()
  let cards;
  // TODO: mejorar con un LoadingIcon o un ErrorSign o algo
  if (isLoading) {
    cards = <p>Cargando!</p>;
  }
  if (isError) {
    cards = <p>error!</p>;
  }

  const [newSus, setNewSus] = useState<Suscripcion>({
    id: 1,
    nombre: "",
    limiteEstablecimientos: 1,
    costoMensual: 1,
  });

  const suscripciones = data
    ?.sort((s1, s2) => s1.costoMensual - s2.costoMensual)
    .map((s, idx) => ({ icono: iconos[idx], ...s }));
  cards = suscripciones?.map((s) => {
    const actual = currentAdmin?.suscripcion.id === s.id;
    return (
      <Card
        bg="light"
        key={s.id}
        color="dark"
        width="14rem"
        variant={actual ? "filled" : "elevated"}
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
          {actual || (
            <SubmitButton onClick={() => setNewSus(s)}>Elegir</SubmitButton>
          )}
        </CardBody>
      </Card>
    );
  });

  return (
    <>
      <Box marginBottom="110px" marginLeft="12%">
        <Text fontSize="4xl">Seleccione el plan al que mejor se adapte</Text>
        <Text fontSize="2xl">Puedes adaptar tu suscripción en función de tus necesidades. Cambia de plan, ajusta características y elige lo que mejor funcione para ti. Consulta los detalles y términos para obtener más información</Text>
      </Box>
      <HStack justifyContent="center" gap="95px" my="50px" as="form">
        {cards}
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmación</ModalHeader>
          <ModalCloseButton />
          <ModalBody>¿Está seguro que quiere cambiar su suscripción?</ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="brand"
              backgroundColor="black"
              onClick={() => mutate({ idSus: newSus.id })}
            >
              Aceptar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
