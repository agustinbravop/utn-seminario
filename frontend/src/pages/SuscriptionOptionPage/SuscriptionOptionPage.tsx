import {
  Button,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  Icon,
  Text,
} from "@chakra-ui/react";
import TopMenu from "../../components/TopMenu/TopMenu";
import { BsRocket, BsShop, BsBuildings } from "react-icons/bs";
import { getSuscripciones } from "../../utils/api/auth";
import { Suscripcion } from "../../models";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

const iconos = [
  <Icon as={BsShop} fill="#47A992" fontSize={90} />,
  <Icon as={BsBuildings} fill="#47A992" fontSize={90} />,
  <Icon as={BsRocket} fill="#47A992" fontSize={90} />,
];

function SuscriptionOptionPage() {
  const { data, isLoading, isError } = useQuery<Suscripcion[]>(
    ["suscripciones"],
    getSuscripciones
  );
  const navigate = useNavigate();

  let cards;
  // TODO: mejorar con un LoadingIcon o un ErrorSign o algo
  if (isLoading) {
    cards = <p>Cargando!</p>;
  }
  if (isError) {
    cards = <p>error!</p>;
  }

  const suscripciones = data
    ?.sort((s1, s2) => s1.costoMensual - s2.costoMensual)
    .map((s, idx) => ({ icono: iconos[idx], ...s }));
  cards = suscripciones?.map((s) => {
    return (
      <Card
        bg="light"
        key="light"
        color="dark"
        width="14rem"
        className="mb-2 mt-4 pt-2"
      >
        <CardHeader margin="auto">{s.icono}</CardHeader>
        <CardBody style={{ textAlign: "center" }}>
          <Heading size="md">{s.nombre}</Heading>
          <Text fontSize="30px" marginBottom="0px">
            ${s.costoMensual}
          </Text>
          <Text>por mes</Text>
          <Text>
            {s.limiteEstablecimientos} establecimiento
            {s.limiteEstablecimientos === 1 ? "" : "s"}
          </Text>
          <Button
            type="button"
            colorScheme='teal'
            variant='outline'
            style={{ marginLeft: "10px" }}
            onClick={() => navigate(`/register?idSuscripcion=${s.id}`)}
          >
            Continuar
          </Button>
        </CardBody>
      </Card>
    );
  });

  return (
    <div>
      <TopMenu />
      <HStack justifyContent="space-around">{cards}</HStack>

      <div
        className="row"
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "5px",
        }}
      ></div>
    </div>
  );
}

export default SuscriptionOptionPage;
