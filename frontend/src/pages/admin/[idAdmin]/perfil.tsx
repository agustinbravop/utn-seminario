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
} from "@chakra-ui/react";

export default function PerfilPage() {
  const { currentAdmin } = useCurrentAdmin();

  return (
    <>
      <div style={{ marginTop: "2rem" }}>
        <Card
          boxSize="40rem"
          width="36%"
          height="70%"
          marginLeft="32%"
          marginTop="5%"
        >
          <CardHeader >
            <Heading size="lg" textAlign="center" >
              Mi perfil
            </Heading>
          </CardHeader>
          <CardBody marginTop="28px" >
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
                <Text fontSize="sm">
                  {currentAdmin?.tarjeta.numero.replace(/.(?=.{4})/g, "*")}
                </Text>
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