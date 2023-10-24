import { Button, HStack, Image, Text } from "@chakra-ui/react";
import NotFoundPageIllustrationSvg from "@/assets/not_found_page_illustration.svg";
import { useNavigate } from "@/router";

/** El plugin generouted muestra esta página si la url no corresponde a ninguna página. */
export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <Text textAlign="center" fontSize="xl">
        Página no encontrada.
      </Text>
      <Image
        src={NotFoundPageIllustrationSvg}
        objectFit="cover"
        objectPosition="50% 50%"
        boxSize="60vh"
        alt="Error 404, página no encontrada"
        margin="auto"
      />
      <HStack justify="center">
        <Button onClick={() => navigate(-1)}>Retroceder</Button>
        <Button onClick={() => navigate("/")}>Volver al inicio</Button>
      </HStack>
    </>
  );
}
