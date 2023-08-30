import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import {
  useEliminarEstablecimiento,
  useEstablecimientosByAdminID,
} from "@/utils/api/establecimientos";
import { defImage } from "@/utils/const/const";
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
  useToast,
} from "@chakra-ui/react";
import { MdPlace } from "react-icons/md";
import { PhoneIcon } from "@chakra-ui/icons";
import { useNavigate, useLocation } from "react-router";
import { Box } from "@chakra-ui/react";
import { useCambiarSuscripcion } from "@/utils/api/administrador";
import { useSuscripciones } from "@/utils/api/auth";

export default function SelectEstablecimiento() {
  const { currentAdmin } = useCurrentAdmin();
  const navigate = useNavigate();
  const toast = useToast();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const IDSuscripcion = Number(searchParams.get('suscripcion'));

  const { mutate: mutateAdmin } = useCambiarSuscripcion({
    onSuccess: () => {
      toast({
        title: "Nueva Suscripción",
        description: `Suscripción actualizada exitosamente.`,
        status: "success",
        isClosable: true,
      });
      navigate(`/admin/${currentAdmin?.id}`);
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

  const { data } = useEstablecimientosByAdminID(Number(currentAdmin?.id));

  const { data: dataSuscripciones } = useSuscripciones();
  let actualAdmin = { ...currentAdmin };


  // const newAdminString = localStorage.getItem('suscripcionNueva') !== null ? localStorage.getItem('suscripcionNueva') : "pepe"
  // const newAdmin = JSON.parse(newAdminString)

  const suscriptionSelected = dataSuscripciones?.find(suscripcion => suscripcion.id === IDSuscripcion);
  const newAdmin = { ...currentAdmin }
  newAdmin.suscripcion = suscriptionSelected;

  const { mutate } = useEliminarEstablecimiento();
  // array de los ids de los establecimientos a conservar. Los no seleccionados se eliminan.
  const [selected, setSelected] = useState<number[]>([]);

  const handleEstablecimientoToggle = (idEst: number) => {
    console.log(newAdmin)
    if (selected.includes(idEst)) {
      setSelected(selected.filter((id) => id !== idEst));
    } else {
      setSelected([...selected, idEst]);
    }
  };

  if (!currentAdmin) {
    navigate("/login");
    return;
  }

  const establecimientos = data?.map((e) => {
    const seleccionado = selected.includes(e.id);
    return (
      <>

        <Card
          width="300px"
          height="400px"
        >
          <Box width="300px" maxWidth="300px" height="200px" maxHeight="200px">
            <Image
              src={e.urlImagen || defImage}
              borderTopRadius="lg"
              alt={`Imagen del establecimiento ${e.nombre}`}
              objectFit="cover"
              height="100%"
              width="100%"
            />
          </Box>
          <CardBody height="300px">
            <VStack spacing="0">
              <Heading size="md" marginBottom="10px">
                {e.nombre}
              </Heading>
              <Text marginBottom="0">
                <Icon as={MdPlace} boxSize={4} mr="2" />{" "}
                {e.direccion}
              </Text>
              <Text>
                <PhoneIcon boxSize={4} mr="2" /> {e.telefono}
              </Text>
              <Text >{e.horariosDeAtencion}</Text>
              <Button
                mt='15px'
                colorScheme={seleccionado ? "red" : "orange"}
                variant={seleccionado ? "solid" : "outline"}
                onClick={() => handleEstablecimientoToggle(e.id)}
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
    const eliminados = data?.filter((e) => !selected.includes(e.id)) || [];
    if (selected.length > currentAdmin.suscripcion.limiteEstablecimientos) {
    }
    console.log(newAdmin)
    mutateAdmin(newAdmin)
    Promise.all(eliminados.map((e) => mutate(e.id)) || []).then(() =>
      navigate(`/admin/${currentAdmin?.id}`)
    );
  };

  const maximo = newAdmin?.suscripcion.limiteEstablecimientos || 0;

  return (
    <>
      <Box marginLeft="12%">
        <Heading size="lg" mb='10px'>Seleccione los establecimientos que desea conservar</Heading>
        <HStack>
          <Text>
            Establecimientos seleccionados:
          </Text>
          <Text
            color={
              selected.length > maximo || selected.length === 0 ? "red" : "black"
            }
          >
            {" "}
            {selected.length} / {maximo}{" "}
          </Text>
        </HStack>

      </Box>
      <br />
      <HStack display="flex" flexWrap="wrap" justifyContent="center">
        {establecimientos}
      </HStack>

      {selected.length > 0 && selected.length < maximo + 1 && (
        <Box width='100%' display='flex' justifyContent='center' mt='30px' >
          <Button
            justifyContent="center"
            textAlign="center"
            onClick={handleSubmit}
          >
            Continuar
          </Button>
        </Box>
      )}


    </>

  );
}
