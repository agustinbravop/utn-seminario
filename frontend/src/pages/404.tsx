import { Button, HStack, Image, Text } from "@chakra-ui/react";
import NotFoundPageIllustrationSvg from "@/assets/svg/not_found_page_illustration.svg";
import { useNavigate } from "@/router";

// `NotFoundPage` es tratado por el generouted plugin, si no encuentra una página correspondiente a la url.
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
