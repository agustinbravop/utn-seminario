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
import { Suscripcion } from "@/models";
import { useNavigate, useLocation } from "react-router";
import { useCambiarSuscripcion } from "@/utils/api/administrador";
import { useState } from "react";
import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { useEstablecimientosByAdminID } from "@/utils/api/establecimientos";

const iconos = [
  <Icon as={BsShop} fill="brand.500" fontSize={90} />,
  <Icon as={BsBuildings} fill="brand.500" fontSize={90} />,
  <Icon as={BsRocket} fill="brand.500" fontSize={90} />,
];

export default function SuscripcionesPage() {
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const navigate = useNavigate();
  const { currentAdmin } = useCurrentAdmin();
  const location = useLocation();

  const { mutate } = useCambiarSuscripcion({
    onSuccess: () => {
      toast({
        title: "Nueva Suscripción",
        description: `Suscripción actualizada exitosamente.`,
        status: "success",
        isClosable: true,
      });
      navigate(-2);
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

  const [newSus, setNewSus] = useState<Suscripcion>(currentAdmin?.suscripcion);

  const { data, isError, isLoading } = useSuscripciones();
  let cards;
  // TODO: mejorar con un LoadingIcon o un ErrorSign o algo
  if (isLoading) {
    cards = <p>Cargando!</p>;
  }
  if (isError) {
    cards = <p>error!</p>;
  }

  let actualAdmin = { ...currentAdmin }; //Para que actualAdmin no haga referencia al objeto currentAdmin sino que se crea una copia profunda

  if (!currentAdmin) {
    navigate("login");
    return;
  }

  const idSuscripcionActual = newSus.id

  const suscripciones = data
    ?.sort((s1, s2) => s1.costoMensual - s2.costoMensual)
    .map((s, idx) => ({ icono: iconos[idx], ...s }));
  cards = suscripciones?.map((s) => {
    // const actual = currentAdmin?.suscripcion.id === s.id;
    const suscripcionActual = idSuscripcionActual === s.id



    return (
      <Card
        bg="light"
        key={s.id}
        color="dark"
        width="14rem"
        variant={suscripcionActual ? "filled" : "elevated"}
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
          {suscripcionActual || (
            <Button colorScheme="brand" variant="outline" onClick={() => setNewSus(s)}>Elegir</Button>
          )}
        </CardBody>
      </Card>
    );
  });

  const { data: establecimientoData } = useEstablecimientosByAdminID(
    Number(currentAdmin?.id)
  );


  function handleSuscripcion(): void {
    console.log(newSus);

    // alert(location.pathname);
    // location.pathname = "/admin/1/perfil/editarSuscripcion?suscripcion=1";
    // const { suscripcion } = location.pathname.searchParams
    // alert(suscripcion);

    delete newSus.icono;
    console.log("Sus antes")
    console.log(currentAdmin.suscripcion)
    actualAdmin.suscripcion = newSus;
    console.log("Sus despues")
    console.log(currentAdmin.suscripcion)
    console.log(actualAdmin);
    if (newSus.limiteEstablecimientos < establecimientoData.length) {
      // localStorage.setItem('suscripcionNueva', JSON.stringify(actualAdmin));
      navigate(`../selectEstab?suscripcion=${actualAdmin.suscripcion.id}`)
    } else {
      console.log(newSus);
      console.log(newSus);
      delete newSus.icono;
      actualAdmin.suscripcion = newSus;
      console.log(actualAdmin);
      mutate(actualAdmin);
    }
  }


  return (
    <>
      <Box marginBottom="5px" marginLeft="12%" marginRight="12%">
        <Heading size="lg">Seleccione el plan al que mejor se adapte</Heading>
        <br />
        <Text>
          Puedes adaptar tu suscripción en función de tus necesidades. Cambia de
          plan, ajusta características y elige lo que mejor funcione para ti.
          Consulta los detalles y términos para obtener más información.
        </Text>
      </Box>
      <HStack justifyContent="center" gap="95px" my="50px" as="form">
        {cards}
      </HStack>
      <Box display="flex" justifyContent="center" >
        <Button onClick={() => navigate(-1)} mr={15} >Cancelar</Button>
        <Button onClick={onOpen} colorScheme="brand" >Aceptar</Button>
      </Box>

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
              onClick={() => handleSuscripcion()
              }
            >
              Aceptar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
