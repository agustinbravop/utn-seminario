import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
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
  const { currentAdmin } = useCurrentAdmin();

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
                <Heading size="xs" textTransform="uppercase">
                  Nombre
                </Heading>
                <Text fontSize="sm">
                  {currentAdmin?.nombre} {currentAdmin?.apellido}
                </Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Usuario
                </Heading>
                <Text fontSize="sm">{currentAdmin?.usuario}</Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Correo
                </Heading>
                <Text fontSize="sm">{currentAdmin?.correo}</Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Teléfono
                </Heading>
                <Text fontSize="sm">{currentAdmin?.telefono}</Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Tarjeta
                </Heading>
                <Text fontSize="sm">
                  {currentAdmin?.tarjeta.numero.replace(/.(?=.{4})/g, "*")}
                </Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Suscripción
                </Heading>
                <Text fontSize="sm">{currentAdmin?.suscripcion.nombre}</Text>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      </VStack>
    </>
  );
}
