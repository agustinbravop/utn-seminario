import {
  Button,
  Card,
  CardBody,
  Heading,
  Icon,
  Image,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { MdPlace } from "react-icons/md";
import { PhoneIcon } from "@chakra-ui/icons";
import { Establecimiento } from "@/models/index";
import { Box } from "@chakra-ui/react";
import { defImage } from "@/utils/const/const";
import { useModificarEstablecimiento } from "@/utils/api/establecimientos";
import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { useQueryClient } from "@tanstack/react-query";

type DeletedEstablecimientoProps = {
  establecimiento: Establecimiento;
  establecimientosActuales: number;
  onRecuperar: () => void;
};

export default function DeletedEstablecimiento({
  establecimiento,
  establecimientosActuales,
  onRecuperar,
}: DeletedEstablecimientoProps) {
  const toast = useToast();
  const { admin } = useCurrentAdmin();
  const queryClient = useQueryClient();

  const { mutate } = useModificarEstablecimiento({
    onSuccess: () => {
      toast({
        title: "Establecimiento recuperado",
        description: `Establecimiento recuperado exitosamente.`,
        status: "success",
        isClosable: true,
      });
      queryClient.refetchQueries(["establecimientos"]);
      onRecuperar();
    },
    onError: () => {
      toast({
        title: "Error al recuperarel establecimiento",
        description: `Intente de nuevo.`,
        status: "error",
        isClosable: true,
      });
    },
  });

  const handleRecuperar = () => {
    const limit = admin?.suscripcion?.limiteEstablecimientos;
    if (establecimientosActuales < limit) {
      const alteredEstablecimiento = { ...establecimiento, eliminado: false };
      console.log(alteredEstablecimiento);
      mutate(alteredEstablecimiento);
    } else {
      toast({
        title: "Límite de establecimientos alcanzado",
        description: `Elimine otro establecimiento para recuperar este o mejore su suscripción`,
        status: "warning",
        isClosable: true,
      });
    }
  };

  return (
    <Card width="300px" height="390px">
      <Box width="300px" maxWidth="300px" height="200px" maxHeight="200px">
        <Image
          src={
            !(establecimiento?.urlImagen === null)
              ? establecimiento?.urlImagen
              : defImage
          }
          borderTopRadius="lg"
          alt={`Imagen del establecimiento ${establecimiento.nombre}`}
          objectFit="cover"
          height="100%"
          width="100%"
        />
      </Box>
      <CardBody height="300px">
        <VStack spacing="0">
          <Heading size="md" marginBottom="10px">
            {establecimiento.nombre}
          </Heading>
          <Text marginBottom="0">
            <Icon as={MdPlace} boxSize={4} mr="2" /> {establecimiento.direccion}
          </Text>
          <Text>
            <PhoneIcon boxSize={4} mr="2" /> {establecimiento.telefono}
          </Text>
          <Text>{establecimiento.horariosDeAtencion}</Text>
          <Button onClick={() => handleRecuperar()} marginTop="2">
            Recuperar
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}
