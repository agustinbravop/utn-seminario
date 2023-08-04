import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import TopMenu from "@/components/TopMenu/TopMenu";
import { Modals } from "@generouted/react-router/lazy";

// `Catch` es tratado por el generouted plugin, si hay algún error al cargar la página.
export const Catch = () => {
  return <div>Something went wrong...</div>;
};

// `Pending` es tratado por el generouted plugin, como fallback de una página lazy loaded.
export const Pending = () => <div>Loading...</div>;

export default function Layout() {
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
