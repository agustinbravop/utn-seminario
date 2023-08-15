import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { Establecimiento } from "@/models";
import {
  deleteEstablecimientoByID,
  getEstablecimientosByAdminID,
} from "@/utils/api/establecimientos";
import { defImage } from "@/utils/const/const";
import { useQuery } from "@tanstack/react-query";
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
import { InfoIcon, PhoneIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { Box } from "@chakra-ui/react";

export default function SelectEstab() {
  const { currentAdmin } = useCurrentAdmin();
  const navigate = useNavigate();

  const { data } = useQuery<Establecimiento[]>(
    ["establecimientos", currentAdmin?.id],
    () => getEstablecimientosByAdminID(Number(currentAdmin?.id))
  );

  const [selected, setSelected] = useState<Establecimiento[]>([]);

  const handleEstado = (est: Establecimiento, b: boolean) => {
    !b
      ? setSelected([...selected, est])
      : setSelected(selected.filter((item) => item !== est));
    console.log(selected);
  };

  const establecimientos = data?.map((e) => {
    const [estado, setEstado] = useState(false);

    const handleClick = (est: Establecimiento) => {
      handleEstado(est, estado);
      setEstado(!estado);
    };

    return (
      <Card
        width="300px"
        height="450px"
        variant={estado ? "filled" : "elevated"}
      >
        <Box width="300px" maxWidth="300px" height="200px" maxHeight="200px">
          <Image
            src={!(e.urlImagen === null) ? e.urlImagen : defImage}
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
            <Link to={`/ests/${e.id}`}>
              <Button leftIcon={<InfoIcon />}>Info</Button>
            </Link>

            <Button
              colorScheme={estado ? "red" : "orange"}
              onClick={() => handleClick(e)}
            >
              {estado ? "Quitar" : "Seleccionar"}
            </Button>
          </HStack>
        </CardFooter>
      </Card>
    );
  });

  const handleSubmit = async () => {
    const promesasDelete: Promise<void>[] =
      data?.map((e) => {
        if (!selected.includes(e)) {
          return deleteEstablecimientoByID(e.id);
        }
        return Promise.resolve();
      }) || [];

    await Promise.all(promesasDelete);

    navigate(`/admin/${currentAdmin?.id}`);
  };

  const maximo = currentAdmin?.suscripcion.limiteEstablecimientos;

  return (
    <>
      <Heading textAlign="center">
        Seleccione los establecimientos que desea
      </Heading>
      <br />
      <HStack display="flex" flexWrap="wrap" justifyContent="center">
        {establecimientos}
      </HStack>
      {selected.length > 0 && selected.length < maximo + 1 ? (
        <Button
          justifyContent="center"
          textAlign="center"
          onClick={handleSubmit}
        >
          Continuar
        </Button>
      ) : null}
    </>
  );
}
