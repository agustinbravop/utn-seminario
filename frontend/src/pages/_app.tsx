import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import TopMenu from "@/components/TopMenu/TopMenu";
import { Modals } from "@generouted/react-router";


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
