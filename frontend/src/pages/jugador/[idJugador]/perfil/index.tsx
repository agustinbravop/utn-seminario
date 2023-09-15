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
  Button,
  HStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function JugadorPerfilPage() {
  const { jugador } = useCurrentJugador();

  return (
    <Card maxWidth="400px" m="auto" height="70%" mt="5%">
      <CardHeader>
        <Heading size="lg" textAlign="center">
          Mi perfil
        </Heading>
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
        <HStack width="100%" mt="20px" wrap="wrap">
          <Link to="editar">
            <Button leftIcon={<EditIcon />}>Editar</Button>
          </Link>
          <Link to="cambiarClave">
            <Button leftIcon={<EditIcon />}>Cambiar Contraseña</Button>
          </Link>
        </HStack>
      </CardBody>
    </Card>
  );
}
