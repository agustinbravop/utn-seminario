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
  Button,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { PiLightbulbFilament } from "react-icons/pi";

export default function AdminPerfilPage() {
  const { admin } = useCurrentAdmin();

  return (
    <Card boxSize="40rem" w="40%" m="auto" h="70%" mt="5%">
      <CardHeader>
        <Heading size="lg" textAlign="center">
          Mi perfil
        </Heading>
      </CardHeader>
      <CardBody mt="28px">
        <Stack divider={<StackDivider />} spacing="2.5" mt="-2rem">
          <Box>
            <Heading size="xs">Nombre</Heading>
            <Text fontSize="sm">
              {admin?.nombre} {admin?.apellido}
            </Text>
          </Box>
          <Box>
            <Heading size="xs">Usuario</Heading>
            <Text fontSize="sm">{admin?.usuario}</Text>
          </Box>
          <Box>
            <Heading size="xs">Correo</Heading>
            <Text fontSize="sm">{admin?.correo}</Text>
          </Box>
          <Box>
            <Heading size="xs">Teléfono</Heading>
            <Text fontSize="sm">{admin?.telefono}</Text>
          </Box>
          <Box>
            <Heading size="xs">Tarjeta</Heading>
            <Text fontSize="sm">
              {admin?.tarjeta.numero.replace(/.(?=.{4})/g, "*")}
            </Text>
          </Box>
          <Box>
            <Heading size="xs">Suscripción</Heading>
            <Text fontSize="sm">{admin?.suscripcion.nombre}</Text>
          </Box>
        </Stack>
        <HStack w="100%" mt="20px" display="flex" wrap="wrap" justify="center">
          <Link to="editar">
            <Button leftIcon={<EditIcon />}>Editar</Button>
          </Link>
          <Link to="cambiarClave">
            <Button leftIcon={<EditIcon />}>Cambiar Contraseña</Button>
          </Link>
          <Link to="editarSuscripcion">
            <Button leftIcon={<Icon as={PiLightbulbFilament} />}>
              Cambiar Suscripción
            </Button>
          </Link>
        </HStack>
      </CardBody>
    </Card>
  );
}
