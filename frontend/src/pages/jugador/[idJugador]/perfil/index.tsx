import { useCurrentJugador } from "@/hooks/useCurrentJugador";
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
  const { currentJugador } = useCurrentJugador();

  return (
    <>
      <VStack>
        <Card boxSize="40rem" width="90%" height="70%" marginTop="5%">
          <CardHeader>
            <Heading size="lg" textAlign="center">
              Mi perfil
            </Heading>
            <Box width="100%" display="flex" flexDirection="column" alignItems="flex-end" >
             <Link to="#">
              <Button mt='10%' height='40px' justifyContent='center' leftIcon={<EditIcon />}>Editar </Button>
            </Link> 
            </Box>
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
