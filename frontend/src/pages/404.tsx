import { Button, HStack, Image, Text } from "@chakra-ui/react";
import NotFoundPageIllustrationSvg from "@/assets/svg/not_found_page_illustration.svg";
import { Link } from "react-router-dom";

// `NotFoundPage` es tratado por el generouted plugin, si no encuentra una página correspondiente a la url.
export default function NotFoundPage() {
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
        <Link to="/">
          <Button>Volver al inicio</Button>
        </Link>
      </HStack>
    </>
  );
}
