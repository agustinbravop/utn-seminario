import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import {
  useEliminarEstablecimiento,
  useEstablecimientosByAdminID,
} from "@/utils/api";
import { FALLBACK_IMAGE_SRC } from "@/utils/constants";
import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Icon,
  Image,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { MdPlace } from "react-icons/md";
import { PhoneIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router";
import { Box } from "@chakra-ui/react";

export default function SelectEstablecimiento() {
  const { admin } = useCurrentAdmin();
  const navigate = useNavigate();

  const { data } = useEstablecimientosByAdminID(Number(admin?.id));

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

  const establecimientos = data?.map((e) => {
    const seleccionado = selected.includes(e.id);
    return (
      <Card
        key={e.id}
        w="300px"
        h="450px"
        variant={seleccionado ? "filled" : "elevated"}
      >
        <Box w="300px" maxWidth="300px" h="200px" maxHeight="200px">
          <Image
            src={e.urlImagen || FALLBACK_IMAGE_SRC}
            borderTopRadius="lg"
            alt={`Imagen del establecimiento ${e.nombre}`}
            objectFit="cover"
            h="100%"
            w="100%"
          />
        </Box>
        <CardBody h="300px">
          <VStack spacing="0">
            <Heading size="md" mb="10px">
              {e.nombre}
            </Heading>
            <Text mb="0">
              <Icon as={MdPlace} boxSize={5} color="gray" /> {e.direccion}
            </Text>
            <Text>
              <PhoneIcon boxSize={3.5} color="gray" /> {e.telefono}
            </Text>
            <Text>{e.horariosDeAtencion}</Text>
          </VStack>
        </CardBody>
        <CardFooter display="flex" justify="center">
          <HStack spacing={5}>
            <Button
              colorScheme={seleccionado ? "red" : "orange"}
              variant={seleccionado ? "solid" : "outline"}
              onClick={() => handleEstablecimientoToggle(e.id)}
            >
              {seleccionado ? "Quitar" : "Seleccionar"}
            </Button>
          </HStack>
        </CardFooter>
      </Card>
    );
  });

  const handleSubmit = async () => {
    const eliminados = data?.filter((e) => !selected.includes(e.id)) || [];
    if (selected.length > admin.suscripcion.limiteEstablecimientos) {
    }

    Promise.all(eliminados.map((e) => mutate(e.id)) || []).then(() =>
      navigate(`/ests`)
    );
  };

  const maximo = admin?.suscripcion.limiteEstablecimientos || 0;

  return (
    <>
      <Heading textAlign="center" as="h1">
        Seleccione los establecimientos que desea conservar
      </Heading>
      <br />
      <Text
        color={
          selected.length > maximo || selected.length === 0 ? "red" : "black"
        }
      >
        {selected.length} / {maximo}
      </Text>
      <HStack display="flex" flexWrap="wrap" justify="center">
        {establecimientos}
      </HStack>
      {selected.length > 0 && selected.length < maximo + 1 && (
        <Button
          justifyContent="center"
          textAlign="center"
          onClick={handleSubmit}
        >
          Continuar
        </Button>
      )}
    </>
  );
}
