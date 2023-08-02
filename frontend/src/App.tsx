import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CurrentAdminProvider } from "./hooks/useCurrentAdmin";
import { ChakraProvider } from "@chakra-ui/react";
<<<<<<< HEAD
import EditEstab from "./pages/EditEstab/EditEstab";
import PerfilPage from "./pages/PerfilPage/PerfilPage";
import NewCourt from "./pages/NewCourt/NewCourt";
import CourtPage from "./pages/CourtPage/CourtPAge"; 
import NotFound from "./pages/NotFoundPage/NotFound";
import EditCourt from "./pages/EditCourt/EditCourt";
=======
import { Routes } from "@generouted/react-router";
>>>>>>> cb21ec71928a91a894bf903e885b7ac2e93d2196
import { theme } from "./themes";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <CurrentAdminProvider>
          <Routes />
        </CurrentAdminProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
