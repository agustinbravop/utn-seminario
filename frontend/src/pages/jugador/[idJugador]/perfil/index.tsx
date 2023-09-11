import { useCurrentJugador } from "@/hooks";
import { EditIcon } from "@chakra-ui/icons";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stack,
  StackDivider,
  Box,
  Text,
  VStack,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function JugadorPerfilPage() {
  const { jugador } = useCurrentJugador();

  return (
    <>
      <VStack>
        <Card boxSize="40rem" width="40%" height="70%" marginTop="5%">
          <CardHeader>
            <Heading size="lg" textAlign="center">
              Mi perfil
            </Heading>
            <Box
              width="100%"
              display="flex"
              flexDirection="column"
              alignItems="flex-end"
            >
              <Link to="editar">
                <Button mt="20%" leftIcon={<EditIcon />}>
                  Editar
                </Button>
              </Link>
            </Box>
          </CardHeader>
          <CardBody marginTop="28px">
            <Stack divider={<StackDivider />} spacing="2.5" marginTop="-2rem">
              <Box>
                <Heading size="xs">Nombre</Heading>
                <Text fontSize="sm">
                  {jugador.nombre} {jugador.apellido}
                </Text>
              </Box>
              <Box>
                <Heading size="xs">Usuario</Heading>
                <Text fontSize="sm">{jugador.usuario}</Text>
              </Box>
              <Box>
                <Heading size="xs">Correo</Heading>
                <Text fontSize="sm">{jugador.correo}</Text>
              </Box>
              <Box>
                <Heading size="xs">Teléfono</Heading>
                <Text fontSize="sm">{jugador.telefono}</Text>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      </VStack>
    </>
  );
}
