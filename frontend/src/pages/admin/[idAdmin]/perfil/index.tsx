import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
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

export default function PerfilPage() {
  const { admin } = useCurrentAdmin();

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
                  Editar{" "}
                </Button>
              </Link>
            </Box>
          </CardHeader>
          <CardBody marginTop="28px">
            <Stack divider={<StackDivider />} spacing="2.5" marginTop="-2rem">
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Nombre
                </Heading>
                <Text fontSize="sm">
                  {admin?.nombre} {admin?.apellido}
                </Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Usuario
                </Heading>
                <Text fontSize="sm">{admin?.usuario}</Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Correo
                </Heading>
                <Text fontSize="sm">{admin?.correo}</Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Teléfono
                </Heading>
                <Text fontSize="sm">{admin?.telefono}</Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Tarjeta
                </Heading>
                <Text fontSize="sm">
                  {admin?.tarjeta.numero.replace(/.(?=.{4})/g, "*")}
                </Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Suscripción
                </Heading>
                <Text fontSize="sm">{admin?.suscripcion.nombre}</Text>
              </Box>
              <Link to="editSuscripcion">
                <Box
                  width="100%"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Link to="editarSuscripcion">
                    <Button>Actualizar Suscripción</Button>
                  </Link>
                </Box>
              </Link>
            </Stack>
          </CardBody>
        </Card>
      </VStack>
    </>
  );
}
