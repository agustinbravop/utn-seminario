import { Box, Heading, Image, Text } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { HeaderMenu } from "@/components/navigation";
import { Modals } from "@generouted/react-router";
import ErrorPageIllustrationSvg from "@/assets/error_page_illustration.svg";

/** El plugin generouted muestra este componente si hubo algún error al cargar la página. */
export function Catch() {
  return (
    <Box as="main" m="40px">
      <Heading m="1em auto" textAlign="center">
        Play Finder
      </Heading>
      <Text textAlign="center" fontSize="xl">
        Error al cargar la página, algo salió mal del lado del cliente.
      </Text>
      <Image
        src={ErrorPageIllustrationSvg}
        objectFit="cover"
        objectPosition="50% 50%"
        boxSize="60vh"
        alt="Error al cargar la página"
        margin="auto"
      />
    </Box>
  );
}

/** Layout común para toda las páginas. */
export default function RootLayout() {
  return (
    <>
      <HeaderMenu />

      <Box as="main" m={{ base: "20px", md: "40px" }}>
        <Outlet />
      </Box>

      <Modals />
    </>
  );
}
