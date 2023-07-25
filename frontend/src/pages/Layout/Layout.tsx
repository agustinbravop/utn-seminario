import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import TopMenu from "../../components/TopMenu/TopMenu";

export default function Layout() {
  return (
    <>
      <TopMenu />

      <Box as="main" m="40px">
        <Outlet />
      </Box>
    </>
  );
}
