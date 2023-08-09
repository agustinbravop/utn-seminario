import { useQuery } from "@tanstack/react-query";
import { Cancha } from "@/models";
import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  Image,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { getCanchaByID } from "@/utils/api/canchas";
import { useParams } from "@/router";
import SubMenu from "@/components/SubMenu/SubMenu";

export default function CourtInfoPage() {
  const { idEst, idCancha } = useParams("/ests/:idEst/canchas/:idCancha");

  const { data } = useQuery<Cancha>(["canchas", idCancha], () =>
    getCanchaByID(Number(idEst), Number(idCancha))
  );
  
  if (!data) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <SubMenu />
      <Heading
        size="md"
        fontSize="26px"
        textAlign="left"
        marginLeft="18%"
        marginTop="20px"
      >
        Información de {data.nombre}
      </Heading>
      <HStack
        marginRight="auto"
        marginLeft="18%"
        marginBottom="30px"
        marginTop="20px"
      >
        <Text>
          Esta es la información que se muestra al usuario de su cancha.
        </Text>
        <HStack
          marginLeft="auto"
          marginRight="15%"
          display="flex"
          alignContent="column"
          spacing={5}
          align="center"
        >
          <Link to="editar">
            <Button leftIcon={<EditIcon />}>Editar Información</Button>
          </Link>
        </HStack>
      </HStack>
      <Box display="flex" justifyContent="center">
        <Card
          boxSize="10rem"
          justifyContent="center"
          display="flex"
          style={{ marginTop: "10px", marginBottom: "1rem" }}
          height="75%"
          width="56%"
        >
          <CardBody height="100%" marginTop="0px">
            <Box display="grid" gridTemplateColumns="1fr 1fr" height="100%">
              <Box>
                <Image
                  src={data.urlImagen}
                  width="1000px"
                  height="400px"
                  objectFit="cover"
                  borderRadius="10px"
                />
              </Box>

              <Box marginTop="55px" marginLeft=" 50px" height="100%">
                <Stack divider={<StackDivider />} spacing="1" marginTop="-2rem">
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Descripción
                    </Heading>
                    <Text fontSize="sm">{data.descripcion}</Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Disciplinas
                    </Heading>
                    <Text fontSize="sm">{data.disciplinas}</Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Está habilitada
                    </Heading>
                    <Text fontSize="sm">{data.habilitada.toString()}</Text>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </div>
  );
}
