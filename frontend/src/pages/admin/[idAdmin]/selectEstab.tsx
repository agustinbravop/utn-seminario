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

export default function selectEstab() {
  const { currentAdmin } = useCurrentAdmin();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery<Establecimiento[]>(
    ["establecimientos", currentAdmin?.id],
    () => getEstablecimientosByAdminID(Number(currentAdmin?.id))
  );

  const [selected, setSelected] = useState<Establecimiento[]>([]);
  const [click, setClick] = useState(false);

  const maximo = currentAdmin?.suscripcion.limiteEstablecimientos;

  const handleSubmit = () => {
    data?.forEach((e) => {
      if (!selected.includes(e)) {
        deleteEstablecimientoByID(e.id);
      }
    });
    navigate(`/admin/${currentAdmin?.id}`);
  };

  const handleAddEst = (est: Establecimiento) => {
    setClick(!click);
    click
      ? setSelected([...selected, est])
      : selected.splice(selected.lastIndexOf(est), 1);
    console.log(selected);
  };

  const establecimientos = data?.map((e) => {
    return (
      <Card width="300px" height="450px">
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
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-eye-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                </svg>
              }
              onClick={() => handleAddEst(e)}
            >
              Seleccionar
            </Button>
          </HStack>
        </CardFooter>
      </Card>
    );
  });

  return (
    <>
      {establecimientos}
      {selected.length >= 1 && selected.length <= maximo ? (
        <Button onClick={handleSubmit}>Continuar</Button>
      ) : null}
    </>
  );
}
