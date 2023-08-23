import { useCurrentJugador } from "@/hooks/useCurrentJugador";
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
} from "@chakra-ui/react";

export default function PerfilPage() {
  const { currentJugador } = useCurrentJugador();

  return (
    <>
      <VStack>
        <Card boxSize="40rem" width="40%" height="70%" marginTop="5%">
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
                  {currentJugador?.nombre} {currentJugador?.apellido}
                </Text>
              </Box>
              <Box>
                <Heading size="xs">Usuario</Heading>
                <Text fontSize="sm">{currentJugador?.usuario}</Text>
              </Box>
              <Box>
                <Heading size="xs">Correo</Heading>
                <Text fontSize="sm">{currentJugador?.correo}</Text>
              </Box>
              <Box>
                <Heading size="xs">Teléfono</Heading>
                <Text fontSize="sm">{currentJugador?.telefono}</Text>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      </VStack>
    </>
  );
}
