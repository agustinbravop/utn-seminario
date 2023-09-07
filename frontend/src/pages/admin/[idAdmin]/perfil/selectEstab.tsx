import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import {
  useEliminarEstablecimiento,
  useEstablecimientosByAdminID,
} from "@/utils/api/establecimientos";
import { FALLBACK_IMAGE_SRC } from "@/utils/consts";
import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Heading,
  Icon,
  Image,
  Text,
  VStack,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { MdPlace } from "react-icons/md";
import { PhoneIcon } from "@chakra-ui/icons";
import { useNavigate, useLocation } from "react-router";
import { Box } from "@chakra-ui/react";
import { useCambiarSuscripcion } from "@/utils/api/administrador";
import { useSuscripciones } from "@/utils/api/auth";

export default function SelectEstablecimiento() {
  const { admin } = useCurrentAdmin();
  const navigate = useNavigate();
  const toast = useToast();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const idSuscripcion = Number(searchParams.get("suscripcion"));

  const { mutate: mutateCambiarSuscripcion } = useCambiarSuscripcion({
    onSuccess: () => {
      toast({
        title: "Nueva Suscripción",
        description: `Suscripción actualizada exitosamente.`,
        status: "success",
      });
      navigate(`/admin/${admin?.id}`);
    },
    onError: () => {
      toast({
        title: "Error al intentar cambiar de suscripción",
        description: `Intente de nuevo.`,
        status: "error",
      });
    },
  });

  const { data: establecimientos } = useEstablecimientosByAdminID(
    Number(admin?.id)
  );
  const { data: suscripciones } = useSuscripciones();

  const suscripcionElegida = suscripciones.find(
    (sus) => sus.id === idSuscripcion
  )!;

  const { mutate } = useEliminarEstablecimiento();
  // array de los ids de los establecimientos a conservar. Los no seleccionados se eliminan.
  const [selected, setSelected] = useState<number[]>([]);

  const handleEstablecimientoToggle = (idEst: number) => {
    if (selected.includes(idEst)) {
      setSelected(selected.filter((id) => id !== idEst));
    } else {
      setSelected([...selected, idEst]);
    }
  };

  const EstablecimientoCardList = establecimientos?.map((est) => {
    const seleccionado = selected.includes(est.id);
    return (
      <>
        <Card width="300px" height="400px">
          <Box width="300px" maxWidth="300px" height="200px" maxHeight="200px">
            <Image
              src={est.urlImagen || FALLBACK_IMAGE_SRC}
              borderTopRadius="lg"
              alt={`Imagen del establecimiento ${est.nombre}`}
              objectFit="cover"
              height="100%"
              width="100%"
            />
          </Box>
          <CardBody height="300px">
            <VStack spacing="0">
              <Heading size="md" marginBottom="10px">
                {est.nombre}
              </Heading>
              <Text marginBottom="0">
                <Icon as={MdPlace} boxSize={4} mr="2" /> {est.direccion}
              </Text>
              <Text>
                <PhoneIcon boxSize={4} mr="2" /> {est.telefono}
              </Text>
              <Text>{est.horariosDeAtencion}</Text>
              <Button
                mt="15px"
                colorScheme={seleccionado ? "red" : "orange"}
                variant={seleccionado ? "solid" : "outline"}
                onClick={() => handleEstablecimientoToggle(est.id)}
              >
                {seleccionado ? "Quitar" : "Seleccionar"}
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </>
    );
  });

  const handleSubmit = async () => {
    const eliminados = establecimientos.filter((e) => !selected.includes(e.id));
    if (selected.length > admin.suscripcion.limiteEstablecimientos) {
    }

    mutateCambiarSuscripcion({
      id: admin.id,
      idSuscripcion: suscripcionElegida.id,
    });

    await Promise.all(eliminados.map((e) => mutate(e.id)));
  };

  const maximo = suscripcionElegida.limiteEstablecimientos || 0;

  return (
    <>
      <Box marginLeft="12%">
        <Heading size="lg" mb="10px">
          Seleccione los establecimientos que desea conservar
        </Heading>
        <HStack>
          <Text>Establecimientos seleccionados:</Text>
          <Text
            color={
              selected.length > maximo || selected.length === 0
                ? "red"
                : "black"
            }
          >
            {selected.length} / {maximo}
          </Text>
        </HStack>
      </Box>
      <br />
      <HStack display="flex" flexWrap="wrap" justifyContent="center">
        {EstablecimientoCardList}
      </HStack>

      {selected.length > 0 && selected.length < maximo + 1 && (
        <Box width="100%" display="flex" justifyContent="center" mt="30px">
          <Button
            justifyContent="center"
            textAlign="center"
            onClick={handleSubmit}
            colorScheme="brand"
          >
            Continuar
          </Button>
        </Box>
      )}
    </>
  );
}
