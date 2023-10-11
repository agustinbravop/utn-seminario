import { Container, Spinner, Text } from "@chakra-ui/react";

export default function LoadingSpinner() {
  return (
    <Container centerContent>
      <Spinner size="lg" />
      <Text>Cargando...</Text>
    </Container>
  );
}
