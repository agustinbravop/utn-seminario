import { Box, Heading, Image, Text } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import TopMenu from "@/components/TopMenu/TopMenu";
import { Modals } from "@generouted/react-router";
import ErrorPageIllustrationSvg from "@/assets/error_page_illustration.svg";

// `Catch` es tratado por el generouted plugin, si hay algún error al cargar la página.
export const Catch = () => {
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
};

export default function RootLayout() {
  return (
    <>
      <TopMenu />

      <Box as="main" m="40px">
        <Outlet />
      </Box>

      <Modals />
    </>
  );
}
