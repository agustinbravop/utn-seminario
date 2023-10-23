import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  HStack,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useSuscripciones } from "@/utils/api";
import { Suscripcion } from "@/models";
import { useNavigate } from "react-router";
import { useCambiarSuscripcion } from "@/utils/api";
import { useState } from "react";
import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { useEstablecimientosByAdminID } from "@/utils/api";
import { ICONOS_SUSCRIPCIONES } from "@/utils/consts";
import { ConfirmSubmitButton } from "@/components/forms";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export default function SuscripcionesPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { admin } = useCurrentAdmin();

  const { mutate } = useCambiarSuscripcion({
    onSuccess: () => {
      toast({
        title: "Nueva Suscripción",
        description: `Suscripción actualizada exitosamente.`,
        status: "success",
      });
      navigate(`/admin/${admin.id}/perfil`);
    },
    onError: () => {
      toast({
        title: "Error al intentar cambiar de suscripción",
        description: `Intente de nuevo.`,
        status: "error",
      });
    },
  });

  const [nuevaSus, setNuevaSus] = useState<Suscripcion>(admin.suscripcion);

  const { data: establecimientos } = useEstablecimientosByAdminID(
    Number(admin.id)
  );

  const { data, isError, isLoading } = useSuscripciones();
  let cards;
  // TODO: mejorar con un LoadingIcon o un ErrorSign o algo
  if (isLoading) {
    cards = <LoadingSpinner />;
  }
  if (isError) {
    cards = <p>error!</p>;
  }

  const suscripciones = data
    .sort((s1, s2) => s1.costoMensual - s2.costoMensual)
    .map((s, idx) => ({ icono: ICONOS_SUSCRIPCIONES[idx], ...s }));

  cards = suscripciones.map((s) => {
    const esSuscripcionActual = nuevaSus.id === s.id;
    return (
      <Card
        bg="light"
        key={s.id}
        color="dark"
        width="14rem"
        variant={esSuscripcionActual ? "filled" : "elevated"}
      >
        <CardHeader margin="auto">{s.icono}</CardHeader>
        <CardBody textAlign="center">
          <Heading size="md">{s.nombre}</Heading>
          <Text fontSize="30px" mb="0px">
            ${s.costoMensual}
          </Text>
          <Text>por mes</Text>
          <Text my="10px">
            {s.limiteEstablecimientos} establecimiento
            {s.limiteEstablecimientos === 1 ? "" : "s"}
          </Text>
          {esSuscripcionActual || (
            <Button
              colorScheme="brand"
              variant="outline"
              onClick={() => setNuevaSus(s)}
            >
              Elegir
            </Button>
          )}
        </CardBody>
      </Card>
    );
  });

  const handleSuscripcion = () => {
    if (nuevaSus.limiteEstablecimientos < establecimientos.length) {
      navigate(`../selectEstab?suscripcion=${nuevaSus.id}`);
    } else {
      mutate({ id: admin.id, idSuscripcion: nuevaSus.id });
    }
  };

  return (
    <>
      <Box mb="5px" ml="12%" mr="12%">
        <Heading size="lg">Seleccione el plan que mejor se adapte</Heading>
        <br />
        <Text>
          Puedes elegir tu suscripción en función de tus necesidades. Cambia de
          plan, ajusta características y elige lo que mejor funcione para ti en
          cualquier momento. Consulta los detalles y términos para obtener más
          información.
        </Text>
      </Box>
      <HStack justifyContent="center" gap="95px" my="50px" as="form">
        {cards}
      </HStack>
      <Center>
        <Button onClick={() => navigate(-1)} mr={15}>
          Cancelar
        </Button>
        <ConfirmSubmitButton
          header="Confirmación"
          body="¿Está seguro que quiere cambiar su suscripción?"
          isLoading={isLoading}
          onSubmit={handleSuscripcion}
        >
          Aceptar
        </ConfirmSubmitButton>
      </Center>
    </>
  );
}
