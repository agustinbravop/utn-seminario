import React from "react";
import { useCurrentAdmin } from "../../hooks/useCurrentAdmin";
import TopMenu from "../../components/TopMenu/TopMenu";
import { PersonFill } from "react-bootstrap-icons";
import Title from "../../components/Title";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stack,
  StackDivider,
  Box,
  Text,
} from "@chakra-ui/react";

export default function PerfilPage() {
  const { currentAdmin } = useCurrentAdmin();

  return (
    <>
      <TopMenu />
      <div className="container" style={{ marginTop: "2rem" }}>
        <Card
          boxSize="40rem"
          style={{ marginLeft: "27%", marginBottom: "1rem" }}
          height="31rem"
        >
          <CardHeader>
            <Heading size="lg" textAlign="center">
              Sobre Mi
            </Heading>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing="1" marginTop="-2rem">
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Nombre
                </Heading>
                <Text fontSize="sm">
                  {currentAdmin?.nombre} {currentAdmin?.apellido}
                </Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  usuario
                </Heading>
                <Text fontSize="sm">{currentAdmin?.usuario}</Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  correo
                </Heading>
                <Text fontSize="sm">{currentAdmin?.correo}</Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  telefono
                </Heading>
                <Text fontSize="sm">{currentAdmin?.telefono}</Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Tarjeta
                </Heading>
                <Text fontSize="sm">{currentAdmin?.tarjeta.numero}</Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Suscripcion
                </Heading>
                <Text fontSize="sm">{currentAdmin?.suscripcion.nombre}</Text>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
